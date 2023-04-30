from django.db.models import Q
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated

from api.v1.recipes.serializers import RecipeSerializer, \
    RecipeDeleteSerializer, CategorySerializer, FavoriteSerializer
from recipes.models import Recipe, Category, Favorite


@api_view(["GET"])
@permission_classes([AllowAny])
def recipes(request):
    instances = Recipe.objects.filter(is_deleted=False)

    # category based filter
    category = request.GET.get("category")
    if category:
        # filter foreignkey model
        instances = instances.filter(Q(category__name__iexact=category))

    context = {
        'request': request
    }
    serializer = RecipeSerializer(instances, many=True, context=context)
    response_data = {
        'status_code': "6000",
        'data': serializer.data
    }
    return Response(response_data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_recipes(request):
    user = request.user
    instances = Recipe.objects.filter(owner=user, is_deleted=False)
    context = {
        "request": request
    }
    serializer = RecipeSerializer(instance=instances, many=True, context=context)
    response_data = {
        "status_code": 6000,
        "data": serializer.data,
    }
    return Response(response_data)


@api_view(["GET"])
@permission_classes([AllowAny])
def recipe(request, slug):
    if Recipe.objects.filter(slug=slug).exists():
        instance = Recipe.objects.get(slug=slug)
        context = {
            'request': request
        }
        serializer = RecipeSerializer(instance, context=context)
        response_data = {
            'status_code': 6000,
            'data': serializer.data
        }
        return Response(response_data)
    else:
        response_data = {
            'status_code': 6001,
            'message': 'Recipe not found.'
        }
        return Response(response_data)


@api_view(['GET'])
@permission_classes([AllowAny])
def search_recipe(request):
    q = request.GET.get('q')
    if not q:
        return Response({
            "status_code": 6001,
            "message": "q parameter is missing"
        })

    # search in recipe name or description
    recipes = Recipe.objects.filter(Q(name__icontains=q) | Q(description__icontains=q))
    serializer = RecipeSerializer(recipes, many=True)
    return Response({
        "status_code": 200,
        "message": "Success",
        "data": serializer.data
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_recipe(request):
    name = request.data.get('name')
    description = request.data.get('description')
    image = request.data.get('image')
    category_id = request.data.get('category_id')
    
    # Make sure the category_id is valid
    if not category_id:
        return Response({
            'status_code': 400,
            'message': 'category_id is required',
        }, status=400)
    
    try:
        category_id = int(category_id)
    except ValueError:
        return Response({
            'status_code': 400,
            'message': 'category_id must be an integer',
        }, status=400)
    
    try:
        category = Category.objects.get(id=category_id)
    except Category.DoesNotExist:
        return Response({
            'status_code': 400,
            'message': f'Category with id {category_id} does not exist',
        }, status=400)
    
    recipe = Recipe.objects.create(
        name=name,
        description=description,
        image=image,
        category=category,
        owner=request.user,
    )
    context = {
        "request": request
    }
    serializer = RecipeSerializer(recipe, context=context)
    return Response(serializer.data, status=201)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_recipe(request, slug):
    try:
        recipe = Recipe.objects.get(slug=slug)
    except Recipe.DoesNotExist:
        return Response({
            'status_code': 404,
            'message': f'Recipe with id {slug} does not exist',
        }, status=404)

    # Make sure the user is the owner of the recipe
    if request.user != recipe.owner:
        return Response({
            'status_code': 403,
            'message': 'You are not owner of this recipe',
        }, status=403)
    
    # Get the category id from the request data
    category_id = request.data.get('category_id')

    # If category_id is provided, update the category field
    if category_id:
        try:
            category = Category.objects.get(id=category_id)
            recipe.category = category
        except Category.DoesNotExist:
            return Response({
                'status_code': 400,
                'message': f'Category with id {category_id} does not exist',
            }, status=400)

    context = {
        "request": request
    }

    serializer = RecipeSerializer(recipe, data=request.data, partial=True, context=context)

    if serializer.is_valid():
        serializer.save()
        response_data = {
            "statuc_code": 6000,
            "data": serializer.data
        }
        return Response(response_data)
    
    response_data = {
        "statuc_code": 6001,
         "error": serializer.errors,
    }

    return Response(response_data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def delete_recipe(request, slug):
    if Recipe.objects.filter(slug=slug, owner=request.user).exists():
        recipe = Recipe.objects.get(slug=slug)
        serailizer = RecipeDeleteSerializer(instance=recipe, data=request.data, partial=True)
        if serailizer.is_valid():
            serailizer.save()
            response_data = {
                "status_code": 6000,
                "message": "Successfully deleted"
            }
        else:
            response_data = {
                "status_code": 6001,
                "message": "Validation error",
                "data": serailizer.errors
            }
    else:
        response_data = {
            "status_code": 6001,
            "message": "Recipe not found"
        }
    return Response(response_data)


# TODO : recipe categories

@api_view(["GET"])
@permission_classes([AllowAny])
def recipe_categories(request):
    instances = Category.objects.all()

    context = {
        "request": request
    }

    serializer = CategorySerializer(instances, many=True, context=context)

    response_data = {
        'status_code': 6000,
        'data': serializer.data
    }

    return Response(response_data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_category(request):
    context = {
        "request": request
    }
    serializer = CategorySerializer(data=request.data, context=context)

    if serializer.is_valid():
        serializer.save()
        response_data = {
            "status_code": 6000,
            "message": "Success",
            "data": serializer.data,
        }
    else:
        response_data = {
            "status_code": 6001,
            "message": "Validation error",
            "data": serializer.errors
        }

    return Response(response_data)


# TODO : Favorites

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def favorite_recipes(request):
    user = request.user
    favorites = Favorite.objects.filter(user=user)

    # TODO Comments for feature
    # values_list() method of the QuerySet object favorites to extract a list of recipe_id values
    # from the Favorite objects.

    # flat=True as an argument, we're telling Django to return a flat list of values, 
    # rather than a list of tuples. This means that the resulting recipe_ids variable is a 
    # list of integers representing the primary keys of the Recipe objects that are in the user's 
    # favorites.

    recipe_ids = favorites.values_list('recipe_name_id', flat=True)
    recipes = Recipe.objects.filter(pk__in=recipe_ids)
    serializer = RecipeSerializer(recipes, many=True, context={'request': request})

    response_data = {
        "status_code": 6000,
        "data": serializer.data
    }

    return Response(response_data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def manage_favorites(request, slug):
    if Recipe.objects.filter(slug=slug).exists():
        recipe = Recipe.objects.get(slug=slug)
        user = request.user
        if not Favorite.objects.filter(user=user, recipe_name=recipe).exists():
            favorite = Favorite.objects.create(user=user, recipe_name=recipe)
            serializer = FavoriteSerializer(favorite)
            response_date = {
                "status_code": 6000,
                "message": "Recipe is added to favorite",
                "data": serializer.data,
            }
            return Response(response_date)
        else:
            favorite = Favorite.objects.get(user=user, recipe_name=recipe)
            favorite.delete()

            return Response({
                "status_code": 6000,
                "message": "Successfully deleted"
            })
    
    response_date = {
        "status_code": 6001,
        "message": "Recipe not found"
    }
    return Response(response_date)



# @api_view(["DELETE"])
# @permission_classes([IsAuthenticated])
# def remove_from_favorites(request, slug):
#     if Recipe.objects.filter(slug=slug).exists():
#         recipe = Recipe.objects.get(slug=slug)
#         user = request.user

#         try:
#             favorite = Favorite.objects.get(user=user, recipe=recipe)
#         except Favorite.DoesNotExist:
#             response_date = {
#                 "status_code": 6001,
#                 "message": "Recipe is not in favorite"
#             }
#             return Response(response_date)
        
#         favorite.delete()
#         return Response({
#             "status_code": 6000,
#             "message": "Successfully deleted"
#         })
    
#     return Response({
#         "status_code": 6001,
#         "message": "Recipe not found."
#     })
