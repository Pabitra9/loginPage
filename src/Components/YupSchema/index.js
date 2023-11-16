import * as Yup from 'yup'

export const singUpSchema = Yup.object({
    name : Yup.string().min(3,"must be at least 3 characters long").max(25).required("Please enter your name"),
    dob : Yup.date().nullable().required("Please enter your Date of Birth"),
    email : Yup.string().email("must be a valid email").required("Please enter your email"),
    phone : Yup.number().min(9).required("Please enter your Phone number"),
    gender : Yup.mixed().oneOf(['male', 'female', 'other','Dont Want to Say']).defined().required('Please select one of these'),
    certificationProgram : Yup.mixed().oneOf(['CHRMP Foundation', 'HRBP Advance', 'HR Analytics','CHRMP BEI','CHRMP Competency Mapping','CHRMP Talent Acquisition','CHRMP Talent Development','Dual(Foundation + HRA)','Dual(HRBP + HRA)','CHRMP Tableau for HR','C&B Planning','Generative AI in HR','PoSH']).defined().required('Please select one of these'),
    registrationDate : Yup.date().nullable().required("Please enter your Date of Registration"),
    education : Yup.string().nullable().required('Please enter your qualification'),
    totalExperience : Yup.number().nullable().required('Please enter your Total Year of Experience'),
    hrExperience : Yup.mixed().oneOf(['0-3', '3-5', '5-7','7 & above']).defined().nullable().required('Please enter your Total Year of Experience in HR'),
    prevOrg : Yup.string().nullable().required('Please enter your Previous Organisation name'),
    currentOrg : Yup.string().nullable().required('Please enter your Current Organisation name'),
    designation : Yup.string().nullable().required('Please enter your Designation'),
    linkedin : Yup.string().url().nullable().required('Please enter your linkedin URL'),
    howFound :  Yup.mixed().oneOf(['Facebook', 'Google', 'LinkedIn','Webinar','Email','Friend Referral']).defined().required('Please select one of these'),
    image : Yup.object().shape({
        file: Yup.mixed().required('File is required'),
    }),
    idProof : Yup.object().shape({
        file: Yup.mixed().required('File is required'),
    }),

})