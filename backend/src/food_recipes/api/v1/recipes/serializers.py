from rest_framework import serializers

from recipes.models import Recipe, Category, Favorite


class RecipeSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    category = serializers.SerializerMethodField()
    id_category = serializers.ReadOnlyField(source='category.id')
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ("id", "owner", "name", "slug", "description", "image", "category", "id_category", "is_favorite")
    
    def get_category(self, instance):
        return instance.category.name
    
    def get_is_favorite(self, obj):
        user =  self.context['request'].user
        print("user", user)
        if user.is_authenticated:
            try:
                Favorite.objects.get(user=user, recipe_name=obj)
                return True
            except Favorite.DoesNotExist:
                pass
        return False


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = '__all__'
        # fields = ("id", "user", "recipe_name")


class RecipeDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("id", "is_deleted")


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name")