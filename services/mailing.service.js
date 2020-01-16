"use strict";
const nodemailer = require("nodemailer");
const { appSetting } = require("../appsetting");

class MailingService {
	/**
	 * send email message to user's email address
	 * @param {string} name name  of user
	 * @param {string} email email address
	 * @param {string} subject email subject
	 * @param {htmlstring} body body of the message
	 * @param {string} title caption of the message
	 * @param {Array} files list of files for attachment
	 */
	async sendEmail(name, email, subject, body, title, files = null) {
		// transport
		if (email) {
			const transport = nodemailer.createTransport({
				host: appSetting.all.smtp_server,
				auth: {
					user: appSetting.all.auth.updated_username,
					pass: appSetting.all.auth.pass
				},
				connectionTimeout: 60000,
				port: appSetting.all.port,
				tls: { rejectUnauthorized: false }
			});
			// compose email here
			const mailOption = {
				to: email,
				from: `${appSetting.all.app_name} Team <${appSetting.all.auth.updated_username}>`,
				html: buildTemplate(name, body, title),
				subject: subject,
				attachments: files
			};

			const res = await transport.sendMail(mailOption);

			if (res.accepted) {
				return {
					status: 200,
					message: "Email sent Successfully"
				};
			} else {
				throw new Error("Mail not sent!");
			}
		} else {
			throw new Error("Email receipent address not defined!");
		}
	}
	/**
	 * Sends email confirmation to user
	 * @param {string} id user's id
	 * @param {string} email user's email address
	 * @param {string} name user's name
	 */
	async sendConfirmEmail(id, email, name) {
		//transport
		const transport = nodemailer.createTransport({
			host: appSetting.all.smtp_server,
			auth: {
				user: appSetting.all.auth.updated_username,
				pass: appSetting.all.auth.pass
			},
			port: appSetting.all.port,
			connectionTimeout: 60000,
			tls: { rejectUnauthorized: false }
		});
		const mailOption = {
			to: email,
			from: `${appSetting.all.app_name} Team <${appSetting.all.auth.updated_username}>`,
			html: buildTemplateForVerification(name, email, id),
			subject: "Account Verification"
		};
		const res = await transport.sendMail(mailOption);
		if (res.accepted) {
			return {
				status: 200,
				message: "Email sent Successfully"
			};
		} else {
			throw new Error("Mail not sent!");
		}
	}

	/**
	 * Send email to user
	 * @param {string} email email address
	 * @param {string} subject message subject
	 * @param {string} body html formatted string
	 */
	async sendEmailMessage(email, subject, body) {
		//send mail here
		const transport = nodemailer.createTransport({
			host: appSetting.all.smtp_server,
			auth: {
				user: appSetting.all.support.email,
				pass: appSetting.all.support.pass
			},
			port: appSetting.all.port,
			connectionTimeout: 60000,
			tls: { rejectUnauthorized: false }
		});
		const mailOption = {
			to: email,
			from: `Tesco Support Team <${appSetting.all.support.email}>`,
			html: buildMailTemplate(body),
			subject: subject
		};
		const res = await transport.sendMail(mailOption);
		if (res.accepted) {
			return {
				status: 200,
				message: `Email sent to ${email} successfully`
			};
		} else {
			throw new Error("Mail not sent!");
		}
	}

	/**
	 * send change of password email
	 * @param {string} id user id
	 * @param {string} name user name
	 * @param {string} email user email address
	 * @param {string} code activation code
	 * @param {string} resetId password reset code
	 */
	async SendPasswordResetLink(id, name, email, code, resetId) {
		//send mail here
		const transport = nodemailer.createTransport({
			host: appSetting.all.smtp_server,
			auth: {
				user: appSetting.all.auth.updated_username,
				pass: appSetting.all.auth.pass
			},
			port: appSetting.all.port,
			connectionTimeout: 60000,
			tls: { rejectUnauthorized: false }
		});
		const mailOption = {
			to: email,
			from: `${appSetting.all.app_name} Team <${appSetting.all.auth.updated_username}>`,
			html: buildPasswordRestTemplate(name, id, code, email, resetId),
			subject: "Password reset"
		};
		const res = await transport.sendMail(mailOption);
		if (res.accepted) {
			return {
				status: 200,
				message: `Email sent to ${email} successfully`
			};
		} else {
			throw new Error("Mail not sent!");
		}
	}
}

function buildTemplateForVerification(name, email, id) {
	return `
         <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${appSetting.all.app_name}</title>
    <style type="text/css">
      #outlook a {padding:0;}
      body{width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}
      .ExternalClass {width:100%;}
      .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div, .ExternalClass blockquote {line-height: 100%;}
      .ExternalClass p, .ExternalClass blockquote {margin-bottom: 0; margin: 0;}
      #backgroundTable {margin:0; padding:0; width:100% !important; line-height: 100% !important;}

      img {outline:none; text-decoration:none; -ms-interpolation-mode: bicubic;}
      a img {border:none;}
      .image_fix {display:block;}

      p {margin: 1em 0;}

      h1, h2, h3, h4, h5, h6 {color: black !important;}
      h1 a, h2 a, h3 a, h4 a, h5 a, h6 a {color: black;}
      h1 a:active, h2 a:active,  h3 a:active, h4 a:active, h5 a:active, h6 a:active {color: black;}
      h1 a:visited, h2 a:visited,  h3 a:visited, h4 a:visited, h5 a:visited, h6 a:visited {color: black;}

      table td {border-collapse: collapse;}
      table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }

      a {color: #3498db;}
      p.domain a{color: black;}

      hr {border: 0; background-color: #d8d8d8; margin: 0; margin-bottom: 0; height: 1px;}

      @media (max-device-width: 667px) {
        a[href^="tel"], a[href^="sms"] {
          text-decoration: none;
          color: blue;
          pointer-events: none;
          cursor: default;
        }

        .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
          text-decoration: default;
          color: orange !important;
          pointer-events: auto;
          cursor: default;
        }

        h1[class="profile-name"], h1[class="profile-name"] a {
          font-size: 32px !important;
          line-height: 38px !important;
          margin-bottom: 14px !important;
        }

        span[class="issue-date"], span[class="issue-date"] a {
          font-size: 14px !important;
          line-height: 22px !important;
        }

        td[class="description-before"] {
          padding-bottom: 28px !important;
        }
        td[class="description"] {
          padding-bottom: 14px !important;
        }
        td[class="description"] span, span[class="item-text"], span[class="item-text"] span {
          font-size: 16px !important;
          line-height: 24px !important;
        }

        span[class="item-link-title"] {
          font-size: 18px !important;
          line-height: 24px !important;
        }

        span[class="item-header"] {
          font-size: 22px !important;
        }

        span[class="item-link-description"], span[class="item-link-description"] span {
          font-size: 14px !important;
          line-height: 22px !important;
        }

        .link-image {
          width: 84px !important;
          height: 84px !important;
        }

        .link-image img {
          max-width: 100% !important;
          max-height: 100% !important;
        }

      }

      @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
        a[href^="tel"], a[href^="sms"] {
          text-decoration: none;
          color: blue;
          pointer-events: none;
          cursor: default;
        }

        .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
          text-decoration: default;
          color: orange !important;
          pointer-events: auto;
          cursor: default;
        }
      }
    </style>
    <!--[if gte mso 9]>
      <style type="text/css">
        #contentTable {
          width: 600px;
        }
      </style>
    <![endif]-->
  </head>

  <body style="width:100% !important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;">
    <table cellpadding="0" cellspacing="0" border="0" id="backgroundTable" style="margin:0; padding:0; width:100% !important; line-height: 100% !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"
    width="100%">
      <tr>
        <td width="10" valign="top">&nbsp;</td>
        <td valign="top" align="center">
          <!--[if (gte mso 9)|(IE)]>
            <table width="600" align="center" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFF; border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
              <tr>
                <td>
                <![endif]-->
                <table cellpadding="0" cellspacing="0" border="0" align="center" style="width: 100%; max-width: 800px; background-color: #FFF; border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;"
                id="contentTable">
                  <tr>
                    <td width="600" valign="top" align="center" style="border-collapse:collapse;">
                      <table align='center' border='0' cellpadding='0' cellspacing='0' style='border: 1em solid #E0E4E8;'
                      width='100%'>
                        <tr>
                          <td align='center'  style='padding: 28px 56px 28px 56px;background: #A7ADB5;color:#ffffff' valign='top'>
                            <div style='font-family: "lato", "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 28px;font-size: 18px;font-weight:400;text-align: center; display: contents;
    '>
    <img alt='${appSetting.all.app_name}' width="100" style="vertical-align: middle;display: block;"
    src="${appSetting.all.url}/assets/images/logo.png"
                              />

                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td align='cneter' style='padding: 20px 16px 28px 16px;' valign='top'>
                            <div style='font-family: "lato", "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 28px;font-size: 18px; color: #333; text-align: center;'>

                            <h4> Welcome to ${appSetting.all.app_name} ${name}!</h4>
                            Thank you for creating a ${appSetting.all.app_name} account.</div>
                          </td>
                        </tr>
                        <tr>
                          <td align='center' style='padding: 0 56px 28px 56px;' valign='top'>
                            <div style='font-family: "lato", "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 28px;font-size: 18px; color: #333;'>
                            Verify your email below to complete your account setup.</div>
                          </td>
                        </tr>
                        <tr>
                          <td align='center' style='padding: 0 56px;' valign='top'>
                            <div>
                              <!--[if mso]>
                                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
                                href="#"
                                style="height:44px;v-text-anchor:middle;width:250px;" arcsize="114%" stroke="f"
                                fillcolor="#E15718">
                                  <w:anchorlock/>
                                <![endif]-->
                                <a style="background-color:#24a982;border-radius:5px;color:#fff;display:inline-block;font-family: &#39;lato&#39;, &#39;Helvetica Neue&#39;, Helvetica, Arial, sans-serif;font-size:18px;line-height:44px;text-align:center;text-decoration:none;width:250px;-webkit-text-size-adjust:none;"
                                href="${appSetting.all.account_url}/verifyaccount/?id=${id}&email=${email}">Verify Account</a>
                                <!--[if mso]>
                                </v:roundrect>
                              <![endif]-->
                            </div>
                          </td>
                          <tr>
                            <td align='left' style='padding: 28px 56px 28px 56px;' valign='top'></td>
                          </tr>
                        </tr>
                      </table>
                      <table style='border: 1px solid #E0E4E8; background: #E0E4E8'
                      width='100%' align='center' border='0' cellpadding='0' cellspacing='0' width='100%'>
                        <tr>
                            <td>
                                <div style=" border: 1px solid #24a982; "></div>
                            </td>
                        </tr>
                        <tr>
                          <td align='center' style='padding: 30px 56px 28px 56px;' valign='middle'>
<span style='font-family: "lato", "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 28px;font-size: 14px; color: #A7ADB5; vertical-align: middle;'>
<p style='font-family: "lato", "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 28px;font-size: 16px; color: #A7ADB5; vertical-align: middle;'>Copyright © 2019 Tesco Investment Inc  7th floor 88 Wood St, Barbican, London EC2V 7RS, UK. All rights reserved. </p>
<p style='font-family: "lato", "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 28px;font-size: 16px; color: #A7ADB5; vertical-align: middle;'>Click here to <a href="https://www.tescotrades.com/?target?Unsubscribe">Unsubscribe</a>!</span> </p>


                          </td>
                        </tr>

                      </table>
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
              </tr>
            </table>
          <![endif]-->
        </td>
        <td width="10" valign="top">&nbsp;</td>
      </tr>
    </table>

  </body>

</html>
        `;
}

function buildTemplate(name, body, title) {
	return `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${appSetting.all.app_name}</title>
    <style type="text/css">
      #outlook a {padding:0;}
      body{width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}
      .ExternalClass {width:100%;}
      .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div, .ExternalClass blockquote {line-height: 100%;}
      .ExternalClass p, .ExternalClass blockquote {margin-bottom: 0; margin: 0;}
      #backgroundTable {margin:0; padding:0; width:100% !important; line-height: 100% !important;}

      img {outline:none; text-decoration:none; -ms-interpolation-mode: bicubic;}
      a img {border:none;}
      .image_fix {display:block;}

      p {margin: 1em 0;}

      h1, h2, h3, h4, h5, h6 {color: black !important;}
      h1 a, h2 a, h3 a, h4 a, h5 a, h6 a {color: black;}
      h1 a:active, h2 a:active,  h3 a:active, h4 a:active, h5 a:active, h6 a:active {color: black;}
      h1 a:visited, h2 a:visited,  h3 a:visited, h4 a:visited, h5 a:visited, h6 a:visited {color: black;}

      table td {border-collapse: collapse;}
      table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }

      a {color: #3498db;}
      p.domain a{color: black;}

      hr {border: 0; background-color: #d8d8d8; margin: 0; margin-bottom: 0; height: 1px;}

      @media (max-device-width: 667px) {
        a[href^="tel"], a[href^="sms"] {
          text-decoration: none;
          color: blue;
          pointer-events: none;
          cursor: default;
        }

        .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
          text-decoration: default;
          color: orange !important;
          pointer-events: auto;
          cursor: default;
        }

        h1[class="profile-name"], h1[class="profile-name"] a {
          font-size: 32px !important;
          line-height: 38px !important;
          margin-bottom: 14px !important;
        }

        span[class="issue-date"], span[class="issue-date"] a {
          font-size: 14px !important;
          line-height: 22px !important;
        }

        td[class="description-before"] {
          padding-bottom: 28px !important;
        }
        td[class="description"] {
          padding-bottom: 14px !important;
        }
        td[class="description"] span, span[class="item-text"], span[class="item-text"] span {
          font-size: 16px !important;
          line-height: 24px !important;
        }

        span[class="item-link-title"] {
          font-size: 18px !important;
          line-height: 24px !important;
        }

        span[class="item-header"] {
          font-size: 22px !important;
        }

        span[class="item-link-description"], span[class="item-link-description"] span {
          font-size: 14px !important;
          line-height: 22px !important;
        }

        .link-image {
          width: 84px !important;
          height: 84px !important;
        }

        .link-image img {
          max-width: 100% !important;
          max-height: 100% !important;
        }

      }

      @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
        a[href^="tel"], a[href^="sms"] {
          text-decoration: none;
          color: blue;
          pointer-events: none;
          cursor: default;
        }

        .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
          text-decoration: default;
          color: orange !important;
          pointer-events: auto;
          cursor: default;
        }
      }
    </style>
    <!--[if gte mso 9]>
      <style type="text/css">
        #contentTable {
          width: 600px;
        }
      </style>
    <![endif]-->
  </head>

  <body style="width:100% !important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;">
    <table cellpadding="0" cellspacing="0" border="0" id="backgroundTable" style="margin:0; padding:0; width:100% !important; line-height: 100% !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"
    width="100%">
      <tr>
        <td width="10" valign="top">&nbsp;</td>
        <td valign="top" align="center">
          <!--[if (gte mso 9)|(IE)]>
            <table width="600" align="center" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFF; border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
              <tr>
                <td>
                <![endif]-->
                <table cellpadding="0" cellspacing="0" border="0" align="center" style="width: 100%; max-width: 800px; background-color: #FFF; border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;"
                id="contentTable">
                  <tr>
                    <td width="600" valign="top" align="center" style="border-collapse:collapse;">
                      <table align='center' border='0' cellpadding='0' cellspacing='0' style='border: 1em solid #E0E4E8;'
                      width='100%'>
                        <tr>
                        <td align='center' style='padding: 26px 16px 28px 16px; background: #A7ADB5; color: #ffffff' valign='center'>
 <img alt="${appSetting.all.app_name}" width="150" style="margin-bottom: 1em;" style="vertical-align: middle;" src="${appSetting.all.url}/assets/images/logo.png"
                              />

                          </td>
                        </tr>
                        <tr>
                          <td align='left' style='padding: 26px' valign='top'>
                            <div style='font-family: "lato", "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 28px;font-size: 14px; color: #333;'>
                            <h6>${title}!</h6>
                            <hr/>

                            Hi ${name},
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td align='left' style='padding: 0 26px;' valign='top'>
                            <div style='font-family: "lato", "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 28px;font-size: 14px; color: #333;'>
                            ${body}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td align='left' style='padding: 0 26px;' valign='top'>
                            <div style='font-family: "lato", "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 28px;font-size: 14px; color: #333;'>
                           <br/><b>Yours</b><br/>
                           ${appSetting.all.app_name} Team
                            </div>
                          </td>
                        </tr>
                      </table>
                      <table style='border: 1px solid #E0E4E8; background: #E0E4E8'
                      width='100%' align='center' border='0' cellpadding='0' cellspacing='0' width='100%'>
                        <tr>
                            <td>
                                <div style=" border: 1px solid #24a982; "></div>
                            </td>
                        </tr>
                        <tr>
                          <td align='center' style='padding: 30px 56px 28px 56px;' valign='middle'>
<span style='font-family: "lato", "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 28px;font-size: 12px; color: #A7ADB5; vertical-align: middle;'>
<p style='font-family: "lato", "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 28px;font-size: 16px; color: #A7ADB5; vertical-align: middle;'>Copyright © 2019 Tesco Investment Inc  7th floor 88 Wood St, Barbican, London EC2V 7RS, UK. All rights reserved. </p>
<p style='font-family: "lato", "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 28px;font-size: 16px; color: #A7ADB5; vertical-align: middle;'>Click here to <a href="https://www.tescotrades.com/?target?Unsubscribe">Unsubscribe</a>!</span> </p>


                          </td>
                        </tr>

                      </table>
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
              </tr>
            </table>
          <![endif]-->
        </td>
        <td width="10" valign="top">&nbsp;</td>
      </tr>
    </table>

  </body>

</html>
        `;
}

function buildMailTemplate(body) {
	return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>swifttradeinvestment</title>
    <style type="text/css">
      #outlook a {padding:0;}
      body{width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}
      .ExternalClass {width:100%;}
      .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div, .ExternalClass blockquote {line-height: 100%;}
      .ExternalClass p, .ExternalClass blockquote {margin-bottom: 0; margin: 0;}
      #backgroundTable {margin:0; padding:0; width:100% !important; line-height: 100% !important;}

      img {outline:none; text-decoration:none; -ms-interpolation-mode: bicubic;}
      a img {border:none;}
      .image_fix {display:block;}

      p {margin: 1em 0;}

      h1, h2, h3, h4, h5, h6 {color: black !important;}
      h1 a, h2 a, h3 a, h4 a, h5 a, h6 a {color: black;}
      h1 a:active, h2 a:active,  h3 a:active, h4 a:active, h5 a:active, h6 a:active {color: black;}
      h1 a:visited, h2 a:visited,  h3 a:visited, h4 a:visited, h5 a:visited, h6 a:visited {color: black;}

      table td {border-collapse: collapse;}
      table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }

      a {color: #3498db;}
      p.domain a{color: black;}

      hr {border: 0; background-color: #d8d8d8; margin: 0; margin-bottom: 0; height: 1px;}

      @media (max-device-width: 667px) {
        a[href^="tel"], a[href^="sms"] {
          text-decoration: none;
          color: blue;
          pointer-events: none;
          cursor: default;
        }

        .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
          text-decoration: default;
          color: orange !important;
          pointer-events: auto;
          cursor: default;
        }

        h1[class="profile-name"], h1[class="profile-name"] a {
          font-size: 32px !important;
          line-height: 38px !important;
          margin-bottom: 14px !important;
        }

        span[class="issue-date"], span[class="issue-date"] a {
          font-size: 14px !important;
          line-height: 22px !important;
        }

        td[class="description-before"] {
          padding-bottom: 28px !important;
        }
        td[class="description"] {
          padding-bottom: 14px !important;
        }
        td[class="description"] span, span[class="item-text"], span[class="item-text"] span {
          font-size: 16px !important;
          line-height: 24px !important;
        }

        span[class="item-link-title"] {
          font-size: 18px !important;
          line-height: 24px !important;
        }

        span[class="item-header"] {
          font-size: 22px !important;
        }

        span[class="item-link-description"], span[class="item-link-description"] span {
          font-size: 14px !important;
          line-height: 22px !important;
        }

        .link-image {
          width: 84px !important;
          height: 84px !important;
        }

        .link-image img {
          max-width: 100% !important;
          max-height: 100% !important;
        }

      }

      @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
        a[href^="tel"], a[href^="sms"] {
          text-decoration: none;
          color: blue;
          pointer-events: none;
          cursor: default;
        }

        .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
          text-decoration: default;
          color: orange !important;
          pointer-events: auto;
          cursor: default;
        }
      }
    </style>
    <!--[if gte mso 9]>
      <style type="text/css">
        #contentTable {
          width: 600px;
        }
      </style>
    <![endif]-->
  </head>

  <body style="width:100% !important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;">
    <table cellpadding="0" cellspacing="0" border="0" id="backgroundTable" style="margin:0; padding:0; width:100% !important; line-height: 100% !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"
    width="100%">
      <tr>
        <td width="10" valign="top">&nbsp;</td>
        <td valign="top" align="center">
          <!--[if (gte mso 9)|(IE)]>
            <table width="600" align="center" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFF; border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
              <tr>
                <td>
                <![endif]-->
                <table cellpadding="0" cellspacing="0" border="0" align="center" style="width: 100%; max-width: 800px; background-color: #FFF; border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;"
                id="contentTable">
                  <tr>
                    <td width="600" valign="top" align="center" style="border-collapse:collapse;">
                      <table align='center' border='0' cellpadding='0' cellspacing='0' style='border: 1em solid #E0E4E8;border-bottom: 0'
                      width='100%'>
                    <tr>
                          <td align='center' style='padding: 26px 16px 28px 16px; background: #A7ADB5; color: #ffffff' valign='center'>
 <img alt="${appSetting.all.app_name}" width="150" style="margin-bottom: 1em;" style="vertical-align: middle;" src="${appSetting.all.url}/assets/images/logo.png"
                              />

                          </td>
                        </tr>

                        <tr>
                          <td align='left' style='padding: 0 16px 28px 16px;' valign='top'>
                            <div style='font-family: "lato", "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 28px;font-size: 14px; color: #333; text-align: justify;'>
                          ${body}
</div>
                          </td>
                        </tr>



                      </table>
                      <table style='border: 1px solid #E0E4E8; background: #E0E4E8'
                      width='100%' align='center' border='0' cellpadding='0' cellspacing='0' width='100%'>
                        <tr>
                            <td>
                                <div style=" border: 1px solid #24a982; "></div>
                            </td>
                        </tr>
                        <tr>
                          <td align='center' style='padding: 30px 16px 28px 16px;' valign='middle'>
<span style='font-family: "lato", "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 28px;font-size: 12px; color: #A7ADB5; vertical-align: middle;'>
<p style='font-family: "lato", "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 28px;font-size: 16px; color: #A7ADB5; vertical-align: middle;'>Copyright © 2019 Tesco Investment Inc  7th floor 88 Wood St, Barbican, London EC2V 7RS, UK. All rights reserved. </p>
<p style='font-family: "lato", "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 28px;font-size: 16px; color: #A7ADB5; vertical-align: middle;'>Click here to <a href="https://www.tescotrades.com/?target?Unsubscribe">Unsubscribe</a>!</span> </p>


                          </td>
                        </tr>

                      </table>
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
              </tr>
            </table>
          <![endif]-->
        </td>
        <td width="10" valign="top">&nbsp;</td>
      </tr>
    </table>

  </body>

</html>
    `;
}

function buildPasswordRestTemplate(name, id, code, email, resetId) {
	return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>swifttradeinvestment</title>
    <style type="text/css">
      #outlook a {padding:0;}
      body{width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}
      .ExternalClass {width:100%;}
      .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div, .ExternalClass blockquote {line-height: 100%;}
      .ExternalClass p, .ExternalClass blockquote {margin-bottom: 0; margin: 0;}
      #backgroundTable {margin:0; padding:0; width:100% !important; line-height: 100% !important;}

      img {outline:none; text-decoration:none; -ms-interpolation-mode: bicubic;}
      a img {border:none;}
      .image_fix {display:block;}

      p {margin: 1em 0;}

      h1, h2, h3, h4, h5, h6 {color: black;}
      h1 a, h2 a, h3 a, h4 a, h5 a, h6 a {color: black;}
      h1 a:active, h2 a:active,  h3 a:active, h4 a:active, h5 a:active, h6 a:active {color: black;}
      h1 a:visited, h2 a:visited,  h3 a:visited, h4 a:visited, h5 a:visited, h6 a:visited {color: black;}

      table td {border-collapse: collapse;}
      table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }

      a {color: #3498db;}
      p.domain a{color: black;}

      hr {border: 0; background-color: #d8d8d8; margin: 0; margin-bottom: 0; height: 1px;}

      @media (max-device-width: 667px) {
        a[href^="tel"], a[href^="sms"] {
          text-decoration: none;
          color: blue;
          pointer-events: none;
          cursor: default;
        }

        .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
          text-decoration: default;
          color: orange !important;
          pointer-events: auto;
          cursor: default;
        }

        h1[class="profile-name"], h1[class="profile-name"] a {
          font-size: 32px !important;
          line-height: 38px !important;
          margin-bottom: 14px !important;
        }

        span[class="issue-date"], span[class="issue-date"] a {
          font-size: 14px !important;
          line-height: 22px !important;
        }

        td[class="description-before"] {
          padding-bottom: 28px !important;
        }
        td[class="description"] {
          padding-bottom: 14px !important;
        }
        td[class="description"] span, span[class="item-text"], span[class="item-text"] span {
          font-size: 16px !important;
          line-height: 24px !important;
        }

        span[class="item-link-title"] {
          font-size: 18px !important;
          line-height: 24px !important;
        }

        span[class="item-header"] {
          font-size: 22px !important;
        }

        span[class="item-link-description"], span[class="item-link-description"] span {
          font-size: 14px !important;
          line-height: 22px !important;
        }

        .link-image {
          width: 84px !important;
          height: 84px !important;
        }

        .link-image img {
          max-width: 100% !important;
          max-height: 100% !important;
        }

      }

      @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
        a[href^="tel"], a[href^="sms"] {
          text-decoration: none;
          color: blue;
          pointer-events: none;
          cursor: default;
        }

        .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
          text-decoration: default;
          color: orange !important;
          pointer-events: auto;
          cursor: default;
        }
      }
    </style>
    <!--[if gte mso 9]>
      <style type="text/css">
        #contentTable {
          width: 600px;
        }
      </style>
    <![endif]-->
  </head>

  <body style="width:100% !important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;">
    <table cellpadding="0" cellspacing="0" border="0" id="backgroundTable" style="margin:0; padding:0; width:100% !important; line-height: 100% !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"
    width="100%">
      <tr>
        <td width="10" valign="top">&nbsp;</td>
        <td valign="top" align="center">
          <!--[if (gte mso 9)|(IE)]>
            <table width="600" align="center" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFF; border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
              <tr>
                <td>
                <![endif]-->
                <table cellpadding="0" cellspacing="0" border="0" align="center" style="width: 100%; max-width: 800px; background-color: #FFF; border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;"
                id="contentTable">
                  <tr>
                    <td width="600" valign="top" align="left" style="border-collapse:collapse;">
                      <table align='center' border='0' cellpadding='0' cellspacing='0' style='border: 1em solid #E0E4E8;'
                      width='100%'>
                        <tr>
                          <td align='center'  style='padding: 28px 56px 28px 56px;background: #A7ADB5;color:#ffffff' valign='top'>
                            <div style='font-family: "lato", "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 28px;font-size: 18px;font-weight:400;text-align: center; display: contents;
    '>
 <img alt="${appSetting.all.app_name}" width="150" style="margin-bottom: 1em;" style="vertical-align: middle;" src="${appSetting.all.url}/assets/images/logo.png"
                              />

                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td align='left' style='padding: 20px 16px 28px 16px;' valign='top'>
                            <div style='font-family: "lato", "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 28px;font-size: 15px; color: #333; text-align: left;'>

                            <h4> Hi ${name}!</h4>
                                <b>There was a request to change your password.</b>
                                <p>If you didn't make this request, just ignore this email, otherwise, click the button below to change your password.</p>
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <td align='center' style='padding: 0 56px;' valign='top'>
                            <div>
                              <!--[if mso]>
                                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
                                href="#"
                                style="height:44px;v-text-anchor:middle;width:250px;" arcsize="114%" stroke="f"
                                fillcolor="#E15718">
                                  <w:anchorlock/>
                                <![endif]-->
                                <a style="background-color:#24a982;border-radius:5px;color:#fff;display:inline-block;font-family: &#39;lato&#39;, &#39;Helvetica Neue&#39;, Helvetica, Arial, sans-serif;font-size:15px;line-height:44px;text-align:center;text-decoration:none;width:250px;-webkit-text-size-adjust:none;"
                                href="https://account.tescotrades.com/account/new-password?id=${id}&email=${email}&resetId=${resetId}&code=${code}">Change Password</a>
                                <!--[if mso]>
                                </v:roundrect>
                              <![endif]-->
                            </div>
                          </td>
                          <tr>
                            <td align='left' style='padding: 28px 16px 28px 16px;' valign='top'></td>
                          </tr>
                        </tr>
                        <tr>
                              <td align='left' style='padding: 20px 16px 28px 16px;' valign='top'>
                            <div style='font-family: "lato", "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 28px;font-size: 14px; color: #828282; text-align: left;'>
 <b>Yours <br/>Tesco Investment Team</b>
                            </td>
                        </tr>
                      </table>
                      <table style='border: 1px solid #E0E4E8; background: #E0E4E8'
                      width='100%' align='center' border='0' cellpadding='0' cellspacing='0' width='100%'>
                        <tr>
                            <td>
                                <div style=" border: 1px solid #24a982; "></div>
                            </td>
                        </tr>
                        <tr>
                          <td align='center' style='padding: 30px 56px 28px 56px;' valign='middle'>
<span style='font-family: "lato", "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 28px;font-size: 12px; color: #A7ADB5; vertical-align: middle;'>
<p style='font-family: "lato", "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 28px;font-size: 16px; color: #A7ADB5; vertical-align: middle;'>Copyright © 2019 Tesco Investment Inc. All rights reserved. </p>
<p style='font-family: "lato", "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 28px;font-size: 16px; color: #A7ADB5; vertical-align: middle;'>Click here to <a href="https://www.tescotrades.com/?target?Unsubscribe">Unsubscribe</a>!</span> </p>


                          </td>
                        </tr>

                      </table>
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
              </tr>
            </table>
          <![endif]-->
        </td>
        <td width="10" valign="top">&nbsp;</td>
      </tr>
    </table>

  </body>

</html>`;
}
// make public
module.exports.mailingService = new MailingService();
