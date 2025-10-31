from django.urls import path
from . import views
from .views import getRooms, postBookings, bookingDetail, getRoomDetail, getBookings, getBookingsByRoom, UserInfoView, favorite_room, get_favorite_rooms, LogoutView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path('getallrooms/', getRooms, name='room-list'),
    path('getallrooms/<int:pk>/', getRoomDetail, name='room-detail'),
    path('postbooking/', postBookings, name='create-booking'), 
    path('getallmybooking/', getBookings, name='get-booking'),
    path('getallmybooking/<int:pk>/', bookingDetail, name='booking-detail'),
    path('getbookingbyroom/<int:pk>/', getBookingsByRoom, name='get-booking-by-room'),
    path('rooms/<int:room_id>/favorite/', favorite_room, name='toggle_favorite_room'),
    path('favorites/', get_favorite_rooms, name='get_favorites'),
    # user authentication JWT (don't touch)
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/', UserInfoView.as_view(), name='user_info'),
    # user authentication JWT (don't touch)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)