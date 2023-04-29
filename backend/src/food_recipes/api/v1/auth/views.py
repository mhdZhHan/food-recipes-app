import json
import requests

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth.models import User
from api.v1.auth.serializers import MyTokenObtainPairSerializer, UserSerializer


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def create(request):
    name = request.data["name"]
    username = request.data["username"]
    email = request.data["email"]
    password = request.data["password"]

    if not User.objects.filter(email=email, username=username).exists():
        user = User.objects.create_user(
            username = username,
            email = email,
            first_name = name,
            password = password,
        )

        headers = {
            'Content-Type': 'application/json'
        }

        data = {
            "username": username,
            "email": email,
            "password": password,
        }

        protocol = "http://"
        if request.is_secure():
            protocol = "https://"
        
        host = request.get_host()

        url = protocol + host + '/api/v1/auth/token/'

        response = requests.post(url, headers=headers, data=json.dumps(data))

        if response.status_code == 200:
            response_data = {
                "status": 6000,
                "message": "User created successfully.",
                "user_name": username,
                "data": response.json(),
            }
        else:
            response_data = {
                "status": "6001",
                "message": "an error occured."
            }
    else:
        response_data = {
            "status": 6001,
            "message": "accout alredy exixts"
        }


    return Response(response_data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_details(request):
    instances = User.objects.filter(username=request.user)
    context = {
        'request': request
    }
    serializer = UserSerializer(instances, many=True, context=context)
    response_data = {
        'status_code': "6000",
        'data': serializer.data
    }
    return Response(response_data)