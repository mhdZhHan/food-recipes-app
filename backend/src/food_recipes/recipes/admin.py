from django.contrib import admin
from recipes.models import Recipe, Category, Favorite


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'description', 'category', 'is_favorite']
    search_fields = ['name']
    list_filter = ('is_favorite', 'category')
    ordering = ('-updated_at',)


admin.site.register(Category)


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'recipe_name', 'is_favorite']
    search_fields = ['user', 'recipe']
    list_filter = ('user',)