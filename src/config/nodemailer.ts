import nodemailer from 'nodemailer';
import env from './env';
import path from 'path';
import hbs from 'nodemailer-express-handlebars';
import { create } from 'express-handlebars';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.MAIL_APP_USER,
    pass: env.MAIL_APP_PASS,
  },
});

const templatesPath = path.resolve(__dirname, '../email/templates');

const handlebarOptions = {
  viewEngine: create({
    extname: '.hbs',
    partialsDir: templatesPath,
    layoutsDir: templatesPath,
    defaultLayout: false,
  }),
  viewPath: templatesPath,
  extName: '.hbs',
};

transporter.use('compile', hbs(handlebarOptions));

export default transporter;
