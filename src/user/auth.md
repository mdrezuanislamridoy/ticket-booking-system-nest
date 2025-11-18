# Implement Authentication and authorization in nest app

## Steps:

- generate access & refresh token
- return to client
- make a refresh token function
- make strategies (1. check cookies, 2. make jwtStrategy class to check if the user is logged in or not )
- Generate Role_String and Roles decorator ( using setMetadata(RoleString,roles))   
- Make guards
  1. JwtAuthGuard {extends AuthGuard('jwt'){}},
  2. Role Guard . use in built guard creation cli {nest g gu role} then that class will extend CanActive class then inside that make constructor with creating instance on Reflector then use the reflector
  ```
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_STR, [
          context.getHandler(),
          context.getClass(),
      ]);
  ```
  then: const user = context.switchToHttp().getRequest().user
  then: check role is matching or not
  // Note: ROLE_STR this is comming from role decorator
