/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { upload } from '../../utils/sendImageToCloudinary';
import { USER_ROLE } from '../User/constant';


// Todo. Everything in this file need to customize according to your requirement

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.admin),
  AdminControllers.getAllAdmins
);
router.get(
  '/:id',
  auth(USER_ROLE.admin),
  AdminControllers.getSingleAdmin
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(updateAdmin)
  AdminControllers.getSingleAdmin
);





export const AdminRoutes = router;