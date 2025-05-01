import React, { useRef } from 'react';
import loginImage from '../assets/loginimage.png';
import '../styles/SignIn.css';

const SignIn = () => {
  // Create refs for each input field
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const termsRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Log all form values
    console.log('Form Submission:', {
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      password: passwordRef.current.value,
      agreedToTerms: termsRef.current.checked
    });
    
    // Here you would typically send data to your backend
    // registerUser({
    //   firstName: firstNameRef.current.value,
    //   // ... other fields
    // });
  
  };

  return (
    <div className='container sign-section'>
      <div className='sign-container'>
        <h3 className='sign-heading'>Register</h3>
        <p className='heading'>Manage all your inventory efficiently</p>
        <p className='subheading'>
          Let's get you all set up so you can verify your personal account and begin setting your work profile
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className='form-row'>
            <div className='form-group'>
              <label>First Name</label>
              <input 
                ref={firstNameRef}
                name='firstName' 
                type='text' 
                placeholder='Enter Your First Name'
                required
              />
            </div>
            <div className='form-group'>
              <label>Last Name</label>
              <input 
                ref={lastNameRef}
                name='lastName' 
                type='text' 
                placeholder='Enter Your Last Name'
                required
              />
            </div>
          </div>
          
          <div className='form-row'>
            <div className='form-group'>
              <label>Email</label>
              <input 
                ref={emailRef}
                name='email' 
                type='email' 
                placeholder='Enter Your Email'
                required
              />
            </div>
            <div className='form-group'>
              <label>Phone NO.</label>
              <input 
                ref={phoneRef}
                name='phoneNo' 
                type='tel'  
                placeholder='Enter Your Phone Number'
                required
              />
            </div>
          </div>
          
          <div className='form-group'>
            <label>Password</label>
            <input 
              ref={passwordRef}
              name='password' 
              type='password' 
              placeholder='Enter Password'
              required
              minLength="8"
            />
          </div>
          
          <div className='checkbox-div'>
            <input 
              ref={termsRef}
              type='checkbox' 
              id="termsCheckbox"
              required
            />
            <label htmlFor="termsCheckbox">
              I agree to all terms, privacy policies, and fees
            </label>
          </div>
          
          <button type="submit" className='sign-btn submit-btn'>
            Sign up
          </button>
          
          <div className='login-link'>
            Already have an account? <a href="/login">Log In</a>
          </div>
        </form>
      </div>
      
      <div className='image-container'>
        <img src={loginImage} className='sign-image' alt='Login visual' />
      </div>
    </div>
  );
};

export default SignIn;