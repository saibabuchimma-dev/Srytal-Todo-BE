interface WelcomeEmployeeEmailProps {
  fullName: string;
  email: string;
  temporaryPassword: string;
  loginUrl: string;
}

export function welcomeEmployeeTemplate({
  fullName,
  email,
  temporaryPassword,
  loginUrl,
}: WelcomeEmployeeEmailProps) {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f6f9;color:#333333;">

<table width="100%" cellpadding="0" cellspacing="0" 
style="background:#ffffff;border:1px solid #dddddd;border-radius:8px;overflow:hidden;font-family:Arial,sans-serif;">
  <tr>
    <td align="center">

      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #dddddd;border-radius:8px;overflow:hidden;font-family:Arial,sans-serif;">

        <tr>
          <td style="background:#0d6efd;padding:24px;text-align:center;color:#ffffff;font-family:Arial,sans-serif;">
            <h1 style="margin:0;font-size:24px;font-weight:bold;">
                SRYTAL Employee Management Portal
            </h1>

            <p style="margin:8px 0 0;font-size:14px;">
              Your account has been created successfully
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:32px;">

            <h2 style="margin:0 0 16px;font-size:22px;color:#222;font-family:Arial,sans-serif;">
              Hello ${fullName},
            </h2>

            <p style="margin:0 0 20px;font-size:15px;line-height:24px;font-family:Arial,sans-serif;">
              Your employee account has been created successfully.
              Use the credentials below to access the SRYTAL Employee Portal.
            </p>

            <table width="100%" cellpadding="12" cellspacing="0" style="border:1px solid #dddddd;border-collapse:collapse;margin:24px 0;">

              <tr>
                <td style="width:180px;background:#f8f9fa;font-weight:bold;border:1px solid #dddddd;">
                  Email
                </td>

                <td style="border:1px solid #dddddd;">
                  ${email}
                </td>
              </tr>

              <tr>
                <td style="background:#f8f9fa;font-weight:bold;border:1px solid #dddddd;">
                  Temporary Password
                </td>

                <td style="border:1px solid #dddddd;font-weight:bold;color:#0d6efd;">
                  ${temporaryPassword}
                </td>
              </tr>

            </table>

            <div style="background:#fff8e5;border-left:4px solid #f0ad4e;padding:16px;margin:24px 0;font-size:14px;line-height:22px;">
              <strong>Important</strong><br><br>
            This is a temporary password. For security reasons, please change your password after your first login. Never share your login credentials with anyone.            
            </div>
            <div style="text-align:center;margin:32px 0;">
              <a href="${loginUrl}"
                 style="background:#0d6efd;color:#ffffff;text-decoration:none;padding:12px 25px;border-radius:7px;font-weight:bold;display:inline-block;">
                Access Employee Portal
              </a>
            </div>

            <p style="margin:0;font-size:14px;line-height:22px;">
              If you have any questions or need assistance accessing your account,
              please contact your administrator.
            </p>

          </td>
        </tr>

        <tr>
          <td style="background:#f8f9fa;padding:20px;text-align:center;font-size:13px;color:#666666;border-top:1px solid #dddddd;">
            <strong>SRYTAL Systems India Pvt Ltd</strong><br><br>
            This is an automated email. Please do not reply to this message.<br><br>
            © ${new Date().getFullYear()} SRYTAL Systems Pvt Ltd. All rights reserved.
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>

</body>
</html>
`;
}
