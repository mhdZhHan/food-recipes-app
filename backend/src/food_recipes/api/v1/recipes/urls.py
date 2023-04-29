from django.urls import path
from api.v1.recipes import views


urlpatterns = [
    path('', views.recipes),
    path('favorites/', views.favorite_recipes),
    path('favorites/manage/<slug:slug>/', views.manage_favorites),
    # path('favorites/remove/<slug:slug>/', views.remove_from_favorites),
    path('categories/', views.recipe_categories),
    path('categories/new/', views.create_category),
    path('create/new/', views.create_recipe),
    path('search/', views.search_recipe),
    path('<slug:slug>/', views.recipe),
    path('edit/<slug:slug>/', views.update_recipe),
    path('delete/<slug:slug>/', views.delete_recipe),
]
