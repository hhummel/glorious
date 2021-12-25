from rest_framework import permissions


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or Admins to see and edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Write permissions are only allowed to the owner of obj or Admins.
        return request.user.is_staff or obj.user == request.user


class IsAdminOrReadOnly(permissions.BasePermission):
    # Read permission for everyone, write for Admin
    def has_permission(self, request, view):
        return request.user.is_staff or request.method in permissions.SAFE_METHODS
