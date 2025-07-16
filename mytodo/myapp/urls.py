# myapp/urls.py
from django.urls import path
from . import Addtodo
from . import auth
urlpatterns = [
  path('enhance', Addtodo.enhance, name='enhance-description'),
  path('create', Addtodo.create, name='create-task-description'),
  path('addtodo', Addtodo.addtodo, name='add-todo'),
  path('register', auth.register, name='register'),
  path('login', auth.login, name='login')
]