from django.db import models

from autoslug import AutoSlugField


class Recipe(models.Model):
    owner = models.ForeignKey('auth.User', related_name='recipes', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    slug = AutoSlugField(populate_from='name')
    description = models.TextField()
    image = models.FileField(upload_to='recipes/images')
    category = models.ForeignKey('recipes.Category', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_deleted = models.BooleanField(default=False)
    is_favorite = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=70)

    def __str__(self):
        return self.name   
    

class Favorite(models.Model):
    user = models.ForeignKey('auth.User', related_name='favorites', on_delete=models.CASCADE)
    recipe_name = models.ForeignKey(Recipe, related_name='favorites', on_delete=models.CASCADE)

    is_favorite = models.BooleanField(default=False)

    def __str__(self):
        return str(self.id)