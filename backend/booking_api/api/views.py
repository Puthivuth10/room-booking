from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Room, Booking
from .serializers import RoomSerializer, BookingSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, TokenError


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getRooms(request):
    rooms = Room.objects.all()
    serializer = RoomSerializer(rooms, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getRoomDetail(request, pk):
    try:
        roomdetail = Room.objects.get(pk=pk)
        serializer = RoomSerializer(roomdetail)
        return Response(serializer.data)
    except Room.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getBookings(request): # request contains all information from http request
    user = request.user # request also contain user
    try:
        bookings = Booking.objects.filter(booker=user)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def getBookingsByRoom(request, pk):
    bookings = Booking.objects.filter(room_id=pk)
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Ensure only logged-in users can post
def postBookings(request):
    data = request.data.copy()
    data['booker'] = request.user.id
    serializer = BookingSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    if not serializer.is_valid():
        print(serializer.errors)  # Add this to your backend logs
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])  
def bookingDetail(request, pk):
    try:
        booking = Booking.objects.get(pk=pk)
    except Booking.DoesNotExist:
        return Response({'detail': 'Booking not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if the booking belongs to the current user
    if booking.booker != request.user:
        return Response({'detail': 'Unauthorized.'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        serializer = BookingSerializer(booking)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = BookingSerializer(booking, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        booking.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
# @api_view(['POST'])
# def api_login(request):
#     username = request.data.get('username')
#     password = request.data.get('password')
#     user = authenticate(request, username=username, password=password)
#     if user is not None:
#         refresh = RefreshToken.for_user(user)
#         return Response({
#             'refresh': str(refresh),
#             'access': str(refresh.access_token),
#         })
#     return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# @api_view(['POST'])
# def api_logout(request):
#     try:
#         refresh_token = request.data.get('refresh')
#         token = RefreshToken(refresh_token)
#         token.blacklist()
#         return Response({"message": "Logged out successfully"})
#     except Exception as e:
#         return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Invalid token or already blacklisted"}, status=status.HTTP_400_BAD_REQUEST)
    
class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "full_name": user.get_full_name(),
            "email": user.email
        })
    
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def favorite_room(request, room_id):
    try:
        room = Room.objects.get(pk=room_id)
        user = request.user

        if request.method == 'GET':
            is_fav = room.favorited_by.filter(id=user.id).exists()
            return Response({'is_favorite': is_fav})

        if request.method == 'POST':
            if room.favorited_by.filter(id=user.id).exists():
                room.favorited_by.remove(user)
                return Response({'status': 'removed'}, status=status.HTTP_200_OK)
            else:
                room.favorited_by.add(user)
                return Response({'status': 'added'}, status=status.HTTP_200_OK)

    except Room.DoesNotExist:
        return Response({'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_favorite_rooms(request):
    user = request.user
    favorites = user.favorite_rooms.all()
    serializer = RoomSerializer(favorites, many=True)
    return Response(serializer.data)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def api_logout(request):
#     try:
#         refresh_token = request.data["refresh"]
#         token = RefreshToken(refresh_token)
#         token.blacklist()
#         return Response({"detail": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
#     except TokenError as e:
#         return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)
#     except Exception as e:
#         return Response({"error": "Something went wrong."}, status=status.HTTP_400_BAD_REQUEST)