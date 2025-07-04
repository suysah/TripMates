const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const Email = require('./../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove sensitive fields
  user.password = undefined;

  // Ensure no further calls to `res` after this
  return res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    photo: req.body.photo,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const url = `${req.protocol}://${req.get('host')}/me`;
  console.log(url);

  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //check if email and password exist
  if (!email || !password) {
    return next(new AppError('Email and Password are required', 400));
  }

  //check if user exist
  const user = await User.findOne({ email }).select('+password');

  //compare password
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrect email or password', 401));
  }

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //   get token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('Please logIn to get access', 401));
  }

  //validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //check if user still exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('The user belonging to this token does not exist', 401)
    );
  }

  // check if user changed the password after the token has issued
  // if (freshUser.changePasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError('User recently changed password, Please login again')
  //   );
  // }
  // grant access to protected routs
  req.user = freshUser;
  res.locals.user = freshUser; // Logged-in user
  next();
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'this is logged out', {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      res.locals.user = currentUser; // Logged-in user
      return next();
    } catch (err) {
      return next(); // Proceed without setting a user if verification fails
    }
  }
  next(); // No token, just proceed
};

//can't pass parameters directly into the middlewaer so wrape it in another fun
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles is an array

    if (!roles.includes(req.user.role)) {
      return next(new AppError('You are not authorized to make changes', 403)); //forbidden
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email address', 404));
  }

  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    new Email(user, resetURL).sendPasswordReset();

    return res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later.',
        500
      )
    );
  }
});

exports.resetPassword = async (req, res, next) => {
  // get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //if token not expired , and there is an user, set the new password
  if (!user) {
    return next(new AppError('Token is invaild or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //update changepasswordAt property for the user using middleware

  //log the user in, send jwt
  createSendToken(user, 200, res);
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1. get user from the collection
  const { currentPassword, newPassword, passwordConfirm } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  // 2. check if the given password is correct
  const isCorrect = await user.correctPassword(currentPassword, user.password);
  if (!isCorrect) {
    return next(
      new AppError(
        'Password does not match. Please enter the correct password'
      ),
      401
    );
  }

  // 3.update password
  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  // 4. log User in , using jwt

  createSendToken(user, 200, res);
});
