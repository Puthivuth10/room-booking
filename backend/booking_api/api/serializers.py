from rest_framework import serializers
from django.utils import timezone
from .models import CustomUser, Room, Booking

# serializer is to convert the data to json file for api and vice versa

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    booker_username = serializers.CharField(source='booker.username', read_only=True)
    room = RoomSerializer(read_only=True)
    room_id = serializers.PrimaryKeyRelatedField(
        queryset=Room.objects.all(), source='room', write_only=True
    )

    class Meta:
        model = Booking
        fields = '__all__'

    def validate(self, data):
        booking_date = data.get('booking_date')
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        room = data.get('room')
        
        if booking_date < timezone.localdate():
            raise serializers.ValidationError("Booking Date cannot be in the past.")

        if (start_time and end_time and start_time >= end_time):
            raise serializers.ValidationError("End time must be after start time.")

        instance_id = self.instance.id if self.instance else None 

        overlapping = Booking.objects.filter(
            booking_date=booking_date,
            room=room,
            start_time__lt=end_time,
            end_time__gt=start_time
        )
        if instance_id:
            overlapping = overlapping.exclude(id=instance_id)

        if overlapping.exists():
            raise serializers.ValidationError("This booking overlaps with another booking.")

        return data
