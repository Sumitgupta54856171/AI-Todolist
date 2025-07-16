from .sbase import supabase
from django.contrib.auth.hashers import make_password, check_password
from django.shortcuts import render, HttpResponse, redirect
from rest_framework.response import Response
from rest_framework.decorators import api_view
@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        print(request.data)
        email = request.data.get('email')
        password = request.data.get('password')
        print(email,password,"this is my first attempt")
       
        print(email,password)
        data = supabase.auth.sign_up({
            "email": email,
            "password": password,
            'username':request.data.get('username')
        })
        response =(
            supabase.table("users")
            .insert([
                {
                    "email": email,
                    "password": password,
                    'username':request.data.get('username')
                }
            ])
            .execute()
        )
        successful ="user registered successfully"
        return Response({data:data,response:response,successful:successful})

@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        email = request.data.get('email')
        password = request.data.get('password')
      
        print(email,password)
        response = (
            supabase.table("users")
            .select("*")
            .eq("email", email)
            .eq("password", password)
            .execute()
        )
        
        print("successfull signin")
        
        return Response({'message':"successfull login"})
   