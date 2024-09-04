# Implementing Email Functionality with NodeMailer in a NestJS Project

1. **DTO Definition**

    Define a Data Transfer Object (DTO) for the password reset feature. `modelName.dto.ts`

    ```typescript
    export class ResetPasswordDto {
        readonly email: string;
        readonly newPassword: string;
    }
    ```

2. **Email Template Creation**

    Design an email template using Handlebars. This would typically be a `eventName.hbs` file in your project.

    ```html
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <style>
                .email-container .logo-img {
                height: 50px;
                }
            </style>
        </head>
        <body>
        <div>
            <h1>Password Reset</h1>
            <p>Your new password is: {{newPassword}}</p>
        </div>
        </body>
    </html>
    ```

3. **Controller Method Addition**

    Implement a controller method that handles the password reset request. `modelName.controller.ts`

    ```typescript
    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }
    ```

4. **Pipe Development**

    Develop a pipe that validates and transforms the data from the password reset request. `modelName.pipe.ts`

    ```typescript
    @Injectable()
    export class ResetPasswordPipe implements PipeTransform {
        transform(value: any, metadata: ArgumentMetadata) {
            // Validate and transform the value here
            return value;
        }
    }
    ```

5. **Service Method Implementation**

    Implement a service method that manages the logic behind the password reset process. `modelName.service.ts`

    ```typescript
    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        // Reset password logic here
    }
    ```

6. **Event Definition**

    Identify and define the events that will trigger the sending of the email. `events.ts`

    ```typescript
    export enum EVENTS {
     PASSWORD_RESET_EVENT = 'passwordReset';
    }
    ```

7. **Event Payload Creation**

    Clearly define the structure of the event payload. `event-payloads.interface.ts`

    ```typescript
    export type EventPayload = {
        [EVENTS.PASSWORD_RESET_EVENT]: {
            email: string;
            password: string;
        };
    }
    ```

8. **Event Implementation**

    Implement an event that triggers the sending of an email when a password reset occurs.

    ```typescript
    this.eventEmitter.emit(PASSWORD_RESET_EVENT, {
        email: resetPasswordDto.email,
        newPassword: resetPasswordDto.newPassword,
    });
    ```
9. **Email Handling**

    Finally, handle the email sending process. Here's an example of how you might do this:
      ```typescript
    @Injectable()
    export class ResetPasswordEvent {
      constructor(
        @Inject(IEmailtoken) readonly email: IEmail,
        @Inject(Logger)
        private readonly logger: LoggerService,
      ) { }

      @OnEvent(EVENTS.ACCOUNT_PASSWORD_RESET)
      async resetPassword(
        data: EventPayload[EVENTS.ACCOUNT_PASSWORD_RESET],
      ): Promise<void> {
        try {
          const { email } = data;
          await this.email.sendMail({
            to: email,
            subject: 'Reset Password',
            template: 'password-reset',
            context: {
                email : data.email,
                password: data.password
            },
          });
          this.logger.log(
            'Account | Event | reset password email sent successfully',
            [`ResetPasswordEvent`],
          );
        } catch (error) {
          this.logger.error(
            'Account | Event | Failed to sent reset password email',
            error.stack,
            ResetPasswordEvent.name,
          );
        }
      }
    }
    ```
10. **Add Event To Module**
    Please and don't forget to add event to module provider
    // app.module.ts
    ```typescript
    @Module({
    providers: [ResetPasswordEvent]
    })
    export class AppModule {}
    ```


By adhering to these steps, you can successfully implement an email sending feature using NodeMailer in a NestJS project with an event emitter.
