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
        if request.url.path == "/finetune/health":
            response = await call_next(request)
            return response

        authorization: str = request.headers.get('authorization')
        if authorization and authorization.startswith('Bearer '):
            token = authorization.split(' ')[1]
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
