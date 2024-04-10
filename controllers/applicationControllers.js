
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
// import cloudinary from "cloudinary";

export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(
      new ErrorHandler("For Posting Item not allowed to access this resource.", 400)
    );
  }

  const { name, email, description, phone, answer, jobId } = req.body;

  const applicantID = {
    user: req.user._id,
    role: "Job Seeker",
  };
  if (!jobId) {
    return next(new ErrorHandler("Item not found!", 404));
  }
  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    return next(new ErrorHandler("Item not found!", 404));
  }
 

  const employerID = {
    user: jobDetails.postedBy,
    role: "Employer",
  };
  const imgsource = jobDetails.item.url;
  const question = jobDetails.question;
  console.log("source",imgsource)
  console.log(typeof imgsource)
  if (
    !name ||
    !email ||
    !description ||
    !phone ||
    !answer ||
    !applicantID ||
    !employerID ||
    !imgsource ||
    !question
  ) {
    return next(new ErrorHandler("Please fill all fields.", 400));
  }
  const application = await Application.create({
    name,
    email,
    description,
    phone,
    answer,
    applicantID,
    employerID,
    imgsource,question
    // resume: {
    //   public_id: cloudinaryResponse.public_id,
    //   url: cloudinaryResponse.secure_url,
    // },
  });
  res.status(200).json({
    success: true,
    message: "Form Submitted!",
    application,
  });
});

export const employerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("For Lost Item not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("For Posting Item not allowed to access this resource.", 400)
      );
    } 
    const { _id } = req.user;
    const applications = await Application.find({ "applicantID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);



export const jobseekerGetApplicationsBYID = catchAsyncErrors(
  async(req,res,next)=>{
    try {
      const {id }=req.params;
      
      // Find the application by ID
      let application = await Application.findById(id);
      console.log("Found application:", application);

      // If the application doesn't exist, return a 404 error
      if (!application) {
        return next(new ErrorHandler("Application not found.", 404));
      }
      
      // Update the application's validate field to true
      application.validate = true;
      application = await application.save();
      console.log("Updated application:", application);

      // Send the updated application in the response
      res.status(200).json({
        success: true,
        message: "Application updated successfully!",
        application
      });
    } catch (error) {
      // Handle any errors that occur during the process
      console.error("Error updating applicationss from bacjend x:", error);
      return next(new ErrorHandler("Internal Server Error", 500));
    }
  }
);


export const jobseekerDeleteApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("For Posting Item not allowed to access this resource.", 400)
      );
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("Application not found!", 404));
    }
    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: "Application Deleted!",
    });
  }
);


export const employerDeleteApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role !== "Employer") {
      return next(
        new ErrorHandler("For Lost Item not allowed to access this resource.", 400)
      );
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("Application not found!", 404));
    }
    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: "Application Deleted!",
    });
  }
);