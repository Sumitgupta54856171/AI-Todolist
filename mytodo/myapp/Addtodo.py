from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .geminiai import generate_createtask_description, enhance_description
from .sbase import supabase

@api_view(['POST'])
def enhance(request):
  if request.method == 'POST':
    print(request.data)
    text = request.data.get('text', '')
    if not text:
        return Response({"error": "Text to enhance is required."}, status=status.HTTP_400_BAD_REQUEST)
    
    enhanced_text = enhance_description(text)
    
    if enhanced_text:
        return Response({'enhanced_text': enhanced_text}, status=status.HTTP_200_OK)
    
    return Response({'error': 'Failed to enhance description.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def create(request):
  if request.method == 'POST':
    print(request.data)
    task_name = request.data.get('task_name', '')
    if not task_name:
        return Response({"error": "Task name is required."}, status=status.HTTP_400_BAD_REQUEST)
        
    description = generate_createtask_description(task_name)

    if description:
        return Response({'description': description}, status=status.HTTP_200_OK)
        
    return Response({'error': 'Failed to generate task description.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def addtodo(request):
    if request.method == 'POST':
        try:
            data = request.data
            print(request.data)
            response = (
                supabase.table("todos")
                .insert([
                    {
                        "task_name": data['task_name'],
                        "description": data['description'],
                        "priority": data['priority'],
                        "status": data['status'],
                        "scheduled_date": data['scheduled_date'],
                        "scheduled_time": data['scheduled_time'],
                    }
                ])
                .execute()
            )
            return Response(response)
        except Exception as exception:
            print(request.data)
            return Response({"error": str(exception)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 # Example: Check Supabase connection


def check_supabase_connection():
    try:
        # Try to fetch 1 row from any table, e.g., 'todos'
        response = supabase.table("todos").select("*").limit(1).execute()
        if response.data is not None:
            print("Supabase connection successful!")
            return True
        else:
            print("Supabase connection failed: No data returned.")
            return False
    except Exception as e:
        print(f"Supabase connection error: {e}")
        return False

# Usage
check_supabase_connection()       