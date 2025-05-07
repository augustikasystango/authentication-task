'use server';
import { hashUserPassword } from "@/lib/hash";
import { createUser } from "@/lib/user";
import { createAuthSession } from "@/lib/auth";
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