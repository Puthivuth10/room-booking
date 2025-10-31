from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.core.exceptions import ValidationError

class CustomUser(AbstractUser):
    class Role(models.TextChoices):
        HEAD = 'head', 'Head'
        ASSISTANT = 'assistant', 'Assistant'
        STAFF = 'staff', 'Staff'
        TEACHER = 'teacher', 'Teacher'
        ADMIN = 'admin', 'Admin'

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.TEACHER
    )

    def __str__(self):
        return f"{self.username} ({self.role})"
    
class Room(models.Model):
    class Building(models.TextChoices):
        STEM_BUILDING = 'stem_building', 'Stem Building'
        BUILDING_A = 'building_A', 'Building A'
        BUILDING_B = 'building_B', 'Building B'
        BUILDING_C = 'building_C', 'Building C'
        BUILDING_D = 'building_D', 'Building D'
        BUILDING_T = 'building_T', 'Building T'

    class RoomType(models.TextChoices):
        CLASSROOM = 'classroom', 'Classroom'
        LAB = 'lab', 'Laboratory'
        MEETING_ROOM = 'meeting_room', 'Meeting Room'
        CONFERENCE_HALL = 'conference_hall', 'Conference Hall'

    building = models.CharField(
        max_length=20,
        choices = Building.choices,
        default=Building.STEM_BUILDING
    )

    room_type = models.CharField(
        max_length=20,
        choices=RoomType.choices,
        default=RoomType.CLASSROOM
    )

    favorited_by = models.ManyToManyField(CustomUser, related_name='favorite_rooms', blank=True)

    image = models.ImageField(upload_to='room_images/', blank=True, null=True)
    room_number = models.CharField(max_length=10)
    capacity = models.PositiveIntegerField()
    has_projector = models.BooleanField(default=False)
    has_aircon = models.BooleanField(default=False)
    has_tv = models.BooleanField(default=False)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.room_number} - {self.get_room_type_display()} ({self.get_building_display()})"
    
    def clean(self):
        if Room.objects.filter(room_number=self.room_number, building=self.building).exclude(id=self.id).exists():
            raise ValidationError("Room with this name and location already exists.")
    
    class Meta:
        ordering = ['building', 'room_number']

    
    
class Booking(models.Model):
    # foreign key
    booker = models.ForeignKey(
        settings.AUTH_USER_MODEL, # use our CustomUser model
        on_delete=models.CASCADE, # if the user is deleted, all his booking will be deleted
        related_name='bookings' # allow us to retreive data from CustomUser model (user)
    )                           # user = CustomUser.objects.get(username='heang')
                                # user.bookings.all()  # thanks to related_name='bookings'

    # foreign key
    room = models.ForeignKey(
        'Room',
        on_delete=models.CASCADE,
        related_name='bookings' 
    )

    booking_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    purpose = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['start_time']

    # def clean(self):
    #     # 1. Validate start/end times
    #     if self.start_time >= self.end_time:
    #         raise ValidationError("End time must be after start time.")

    #     # 2. Check for overlapping bookings in the same room on the same date
    #     conflicts = Booking.objects.filter(
    #         booking_date=self.booking_date,
    #         room=self.room,
    #         start_time__lt=self.end_time,
    #         end_time__gt=self.start_time,
    #     )

    #     # Exclude self when updating existing booking
    #     if self.pk:
    #         conflicts = conflicts.exclude(pk=self.pk)

    #     if conflicts.exists():
    #         raise ValidationError("This room is already booked during that time.")

    # def save(self, *args, **kwargs):
    #     self.clean()
    #     super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.booker.username} booked {self.room} on {self.booking_date.strftime('%Y-%m-%d %H:%M')}"
    