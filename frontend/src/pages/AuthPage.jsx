import { SignInButton, SignUpButton } from '@clerk/react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Utensils } from 'lucide-react'

export default function AuthPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4'>
      <Card className='w-full max-w-md shadow-2xl'>
        <CardHeader className='text-center space-y-4'>
          <div className='flex justify-center'>
            <div className='w-12 h-12 bg-primary rounded-lg flex items-center justify-center'>
              <Utensils className='w-6 h-6 text-primary-foreground' />
            </div>
          </div>
          <CardTitle className='text-3xl'>DineFlow</CardTitle>
          <CardDescription>
            Streamline your restaurant operations with ease
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-3'>
            <SignInButton mode='modal'>
              <Button className='w-full' size='lg'>
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode='modal'>
              <Button className='w-full' size='lg' variant='outline'>
                Sign Up
              </Button>
            </SignUpButton>
          </div>
          <div className='text-center text-sm text-muted-foreground mt-6'>
            <p className='mb-3'>Manage your restaurant efficiently</p>
            <ul className='space-y-2 text-xs'>
              <li>✓ Easy order management</li>
              <li>✓ Table tracking</li>
              <li>✓ Real-time analytics</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
