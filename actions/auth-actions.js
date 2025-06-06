'use server';
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createUser, getUserByEmail } from "@/lib/user";
import { createAuthSession, verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
export async function signup( prevState,formData)
{
    const email = formData.get('email');
    const password = formData.get('password');

    let errors = {};

    if(!email.includes('@'))
    {
        errors.email = 'Please enter a valid email address'
    }
    if(password.trim().length < 8)
    {
        errors.password = 'Password must be atleast 8 charcters long.'
    }

    if(Object.keys(errors).length > 0)
    return {
        errors,
    };
    const hashedPassword = hashUserPassword(password);
    try
   { 
    
    const id = createUser(email,hashedPassword  );
    await createAuthSession(id);
    redirect('/training')
    }
   catch(error)
   {
    if(error.code === ' SQLITE_CONSTRAINT_UNIQUE'){
        return {
            errors : {
                email : 'Email already exists for this account'
            }
        }
    }
    throw error;

   }
   redirect('/training');


}

export async function login(prevState,formData)
{
    const email = formData.get('email');
    const password = formData.get('password');

    const existingUser = getUserByEmail(email);

    if(!existingUser)
    {
        return {
            errors:{
                email : 'Could not authenticate user , please check your credentials.'
            }
        }
    }
    const isValidPassword = verifyPassword(existingUser.password,password);

    if(!isValidPassword)
    {
        return {
            errors:{
                email : 'Could not authenticate user , please check your credentials.'
            }
        }
    }
    await createAuthSession(existingUser.id);
    redirect('/training')



}

export async function auth(mode,prevState,formData)
{
    if(mode === 'login')
    {
        return login(prevState,formData)
    }
    return signup(prevState,formData);

}