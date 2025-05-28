// src/app/signup/page.tsx

'use client'; // 상태 관리를 위해 클라이언트 컴포넌트로 지정

import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className='max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md'>
      <h1 className='text-3xl font-bold text-center text-slate-700 mb-8'>회원가입</h1>
      <form className='space-y-6'>
        <div>
          <label htmlFor='username' className='block text-sm font-medium text-slate-600'>
            아이디
          </label>
          <input
            type='text'
            name='username'
            id='username'
            required
            className='mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
          />
        </div>
        <div>
          <label htmlFor='email' className='block text-sm font-medium text-slate-600'>
            이메일
          </label>
          <input
            type='email'
            name='email'
            id='email'
            required
            className='mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
          />
        </div>
        <div>
          <label htmlFor='password' className='block text-sm font-medium text-slate-600'>
            비밀번호
          </label>
          <input
            type='password'
            name='password'
            id='password'
            required
            className='mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
          />
        </div>
        <div>
          <label htmlFor='passwordConfirm' className='block text-sm font-medium text-slate-600'>
            비밀번호 확인
          </label>
          <input
            type='password'
            name='passwordConfirm'
            id='passwordConfirm'
            required
            className='mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
          />
        </div>
        <button
          type='submit'
          className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        >
          가입하기
        </button>
      </form>
      <p className='mt-6 text-center text-sm text-slate-500'>
        이미 계정이 있으신가요?{' '}
        <Link href='/login' className='font-medium text-blue-600 hover:text-blue-500'>
          로그인
        </Link>
      </p>
    </div>
  );
}
