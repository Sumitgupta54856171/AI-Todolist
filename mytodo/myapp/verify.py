from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

class token(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls,user):
        token - super().get_token(user)
        token["uesrname"] = user.username
        token["email"]= user.email
        return token
    def validate(self,attrs):
        data = super().validate(attrs)
        data['user']={
            'username':self.user.username,
             'email':self.user.email,
        }
        return data
class Customtoken(TokenObtainPair)    