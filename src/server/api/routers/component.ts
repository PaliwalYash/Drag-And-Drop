import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const componentRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      const components = await ctx.db.component.findMany();
      
      const sortedComponents = components.sort((a, b) => {
        if (a.position !== b.position) {
          return a.position - b.position;
        }
        return (a.panePosition || 0) - (b.panePosition || 0);
      });
      
      return sortedComponents;
    } catch (error) {
      console.error("Error fetching components:", error);
      return [];
    }
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        type: z.string(),
        content: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const allComponents = await ctx.db.component.findMany({
          select: { position: true }
        });
        
        const newPosition = allComponents.length > 0 
          ? Math.max(...allComponents.map(c => c.position)) + 1
          : 0;
        
        const newPaneId = `pane-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const component = await ctx.db.component.create({
          data: {
            name: input.name,
            type: input.type,
            content: input.content,
            position: newPosition,
            paneId: newPaneId,
            panePosition: 0
          }
        });

        return component;
      } catch (error) {
        console.error("Error creating component:", error);
        throw new Error("Failed to create component");
      }
    }),

  reorder: publicProcedure
    .input(
      z.object({
        components: z.array(
          z.object({
            id: z.string(),
            position: z.number(),
            paneId: z.string().nullable(),
            panePosition: z.number().nullable()
          })
        )
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        for (const component of input.components) {
          await ctx.db.component.update({
            where: { id: component.id },
            data: {
              position: component.position,
              paneId: component.paneId,
              panePosition: component.panePosition
            }
          });
        }

        return { success: true };
      } catch (error) {
        console.error("Error reordering components:", error);
        throw new Error("Failed to reorder components");
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.component.delete({
          where: { id: input.id }
        });
        return { success: true };
      } catch (error) {
        console.error("Error deleting component:", error);
        throw new Error("Failed to delete component");
      }
    }),

  createHorizontalGroup: publicProcedure
    .mutation(async ({ ctx }) => {
      try {
        const existingPlaceholder = await ctx.db.component.findFirst({
          where: { type: "placeholder" }
        });

        if (existingPlaceholder) {
          return { 
            success: false, 
            message: "An empty group already exists"
          };
        }

        const allComponents = await ctx.db.component.findMany({
          select: { position: true }
        });
        
        const newPosition = allComponents.length > 0 
          ? Math.max(...allComponents.map(c => c.position)) + 1
          : 0;
        
        const newPaneId = `pane-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const placeholderComponent = await ctx.db.component.create({
          data: {
            name: "Empty Group Placeholder",
            type: "placeholder",
            content: null,
            position: newPosition,
            paneId: newPaneId,
            panePosition: 0
          }
        });
        
        return { 
          success: true, 
          paneId: newPaneId,
          position: newPosition,
          placeholderId: placeholderComponent.id
        };
      } catch (error) {
        console.error("Error creating horizontal group:", error);
        throw new Error("Failed to create horizontal group");
      }
    }),

  deletePlaceholder: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.component.delete({
          where: { id: input.id }
        });
        return { success: true };
      } catch (error) {
        console.error("Error deleting placeholder:", error);
        throw new Error("Failed to delete placeholder");
      }
    })
});