from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from api.v1.recipes.views import admin_recipes


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/recipes/', include('api.v1.recipes.urls')),
    path('api/v1/admin/recipes/', admin_recipes),
    path('api/v1/auth/', include('api.v1.auth.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
