import { nextTick } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import ClassView from '@/views/ClassView.vue';
import ClassesView from '@/views/ClassesView.vue';
import CourseView from '@/views/CourseView.vue';
import CoursesView from '@/views/CoursesView';
import DepartmentView from '@/views/DepartmentView';
import DepartmentsView from '@/views/DepartmentsView';
import HomeView from '@/views/HomeView.vue';
import RegisterView from '@/views/RegisterView';
import RequestPasswordResetView from '@/views/RequestPasswordResetView';
import ResendEmailView from '@/views/ResendEmailView';
import ResetPasswordView from '@/views/ResetPasswordView';
import SettingsView from '@/views/SettingsView';
import StaffView from '@/views/StaffView';
import StaffsView from '@/views/StaffsView';
import UserView from '@/views/UserView';
import UsersView from '@/views/UsersView';
import VerifyEmailView from '@/views/VerifyEmailView';
import WriteReviewView from '@/views/WriteReviewView';
import NotFoundView from '@/views/NotFoundView';

const routes = [
  {
    path: '/',
    component: HomeView,
    meta: {
      title: 'Home'
    }
  },
  {
    path: '/classes',
    component: ClassesView,
    meta: {
      title: 'Classes · Discover'
    }
  },
  {
    path: '/classes/:classId',
    component: ClassView,
    meta: {
      title: '… · Classes'
    }
  },
  {
    path: '/classes/:classId/write',
    component: WriteReviewView,
    meta: {
      title: 'Write Review · … · Classes'
    }
  },
  {
    path: '/courses',
    component: CoursesView,
    meta: {
      title: 'Courses · Discover'
    }
  },
  {
    path: '/courses/:courseId',
    component: CourseView,
    meta: {
      title: '… · Courses'
    }
  },
  {
    path: '/departments',
    component: DepartmentsView,
    meta: {
      title: 'Departments · Discover'
    }
  },
  {
    path: '/departments/:departmentId',
    component: DepartmentView,
    meta: {
      title: 'Departments · Discover'
    }
  },
  {
    path: '/register',
    component: RegisterView,
    meta: {
      title: 'Sign Up'
    }
  },
  {
    path: '/resend-email',
    component: ResendEmailView,
    meta: {
      title: 'Resend Verification Email'
    }
  },
  {
    path: '/reset-password',
    component: RequestPasswordResetView,
    meta: {
      title: 'Reset Password'
    }
  },
  {
    path: '/reset-password/:token',
    component: ResetPasswordView,
    meta: {
      title: 'Reset Password'
    }
  },
  {
    path: '/settings',
    component: SettingsView,
    meta: {
      title: 'Settings'
    }
  },
  {
    path: '/staffs/:staffId',
    component: StaffView,
    meta: {
      title: '… · Instructors'
    }
  },
  {
    path: '/staffs',
    component: StaffsView,
    meta: {
      title: 'Instructors · Discover'
    }
  },
  {
    path: '/users',
    component: UsersView,
    meta: {
      title: 'Users · Discover'
    }
  },
  {
    path: '/users/:userId',
    component: UserView,
    meta: {
      title: '… · Users'
    }
  },
  {
    path: '/verify-email/:token',
    component: VerifyEmailView,
    meta: {
      title: 'Verify Email Address'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFoundView,
    meta: {
      title: 'Page Not Found'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(to => {
  nextTick(() => {
    document.title = to.meta.title;
  }).then();
});

export default router;
