from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from jose import jwt, JWTError
import requests
import os
from app.config.ddb_config import table

class Config:
    USER_POOL_ID = os.getenv('USER_POOL_ID')
    CLIENT_ID = os.getenv('CLIENT_ID')
    AWS_REGION_NAME = os.getenv('AWS_REGION_NAME')
    COGNITO_ISSUER = f"https://cognito-idp.{AWS_REGION_NAME}.amazonaws.com/{USER_POOL_ID}"
    JWKS_URL = f"{COGNITO_ISSUER}/.well-known/jwks.json"

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path == "/":
            response = await call_next(request)
            return response

        authorization: str = request.headers.get('authorization')
        if authorization and authorization.startswith('Bearer '):
            token = authorization.split(' ')[1]
            token = 'eyJraWQiOiJUYThnWUxJWW5yalhabGRzN0M3QnBlekdSMzNqalY0Q0RaaXZOWHNwdmI0PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyNGE4NTQ4OC0xMDQxLTcwMzEtMDcxMy05OWY0YWFhYjUwYTEiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYWRkcmVzcyI6eyJmb3JtYXR0ZWQiOiJhc2QifSwiYmlydGhkYXRlIjoiMjAyNC0wMi0yOSIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX1g4eWVQS2xleCIsImNvZ25pdG86dXNlcm5hbWUiOiIyNGE4NTQ4OC0xMDQxLTcwMzEtMDcxMy05OWY0YWFhYjUwYTEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJoYXNoLmh1c3NhaW41MyIsImdpdmVuX25hbWUiOiJZb3VyR2l2ZW5OYW1lIiwib3JpZ2luX2p0aSI6IjJjNGUzZDE5LWY1YjktNDg0Mi1iN2YwLWI1YzNlYjgyZmMyZiIsImF1ZCI6ImUzNHRraGZvZXB1amdyZTBpbXQ3Z2lrcHQiLCJldmVudF9pZCI6IjA4YjgxODRjLTBjMWItNDgzMC1hYThmLWVlNzM0M2IzNzg1NiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzE2Mzk0MzUxLCJleHAiOjE3MTY4MzQwMjUsImlhdCI6MTcxNjgzMDQyNSwianRpIjoiMGQ4ZTFmZjYtNGQ5OC00NjljLTlmODgtMzZkYjJiMmJmYjUwIiwiZW1haWwiOiJoYXNoLmh1c3NhaW41M0BnbWFpbC5jb20ifQ.u8za1UP-X8bHX8nG6YMIcJGvvBKUmdCUSnLUPiVuD_LowuyN_DvmMVoNgtXPqy5iH3WES5MyJlyJYxWxz4mcyvy-YjteLAcupL89dx915tPhy1gXal73F1jvn2oagIy8doAe09qZa_0gdWYDgQEOubePgVtqxDv_76w2hChV9vYDvBWaR7XbWx2v3cRjIR89kIp-RjMPLkV82gLbwZvYrZre9i49ogxDIhbuDwoWe3MFDbDURaMOmzRmGZQqd_VW0KSjD7dv7AkTPT4DnNMdlw2Ec6MaaVYF__4RVoWGtJJC5pE8Vzgwwf_GnN3LwicerVk2J2i1hMcX04uWz6weug'
            if not token:
                raise HTTPException(status_code=401, detail="No token provided")

            try:
                jwks = requests.get(Config.JWKS_URL).json()
                unverified_headers = jwt.get_unverified_headers(token)
                rsa_key = {}
                for key in jwks['keys']:
                    if key['kid'] == unverified_headers['kid']:
                        rsa_key = {
                            'kty': key['kty'],
                            'kid': key['kid'],
                            'use': key['use'],
                            'n': key['n'],
                            'e': key['e']
                        }
                if not rsa_key:
                    raise HTTPException(status_code=401, detail="No matching key found in JWKS")

                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=["RS256"],
                    audience=Config.CLIENT_ID,
                    issuer=Config.COGNITO_ISSUER
                )

                user_id = payload['sub']
                user_email = payload['email']

                response = table.get_item(
                    Key={
                        'PK': f'USER#{user_id}',
                        'SK': f'USEREMAIL#{user_email}'
                    }
                )

                if 'Item' not in response:
                    raise HTTPException(status_code=404, detail="User not found")

                request.state.user = response['Item']
            except JWTError as e:
                print(e)
                raise HTTPException(status_code=401, detail="Token not valid")
            except Exception as e:
                print(e)
                raise HTTPException(status_code=500, detail="Internal server error")
        else:
            raise HTTPException(status_code=401, detail="No token provided")

        response = await call_next(request)
        return response
