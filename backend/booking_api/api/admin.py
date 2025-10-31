from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Room, Booking
from .forms import CustomUserCreationForm, CustomUserChangeForm
from django.utils import timezone


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ('username', 'role', 'email', 'is_active')
    list_filter = ('is_staff', 'is_active', 'role')
    fieldsets = (
        (None, {'fields': ('username', 'role', 'email', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'role', 'email', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ('username', 'email')
    ordering = ('username',)

admin.site.register(CustomUser, CustomUserAdmin)

@admin.register(Room)
class RoomsAdmin(admin.ModelAdmin):
    list_display = ('room_number', 'building', 'room_type', 'capacity', 'has_projector', 'has_aircon', 'has_tv')
    list_filter = ('building', 'room_type')
    search_fields = ('room_number',)

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('booker', 'room', 'start_time', 'end_time', 'booking_date', 'is_completed')
    list_filter = ('room', 'start_time', 'booking_date')
    ordering = ('-booking_date', '-start_time', '-created_at')
    
    def is_completed(self, obj):
        now = timezone.now()
        return obj.booking_date < now.date() or (obj.booking_date == now.date() and obj.end_time < now.time())
    is_completed.boolean = True
    is_completed.short_description = 'Completed'