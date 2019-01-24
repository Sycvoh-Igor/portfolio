import Home from 'pages/Home';
import Page1 from 'pages/Page1';
import Page2 from 'pages/Page2';
import Page3 from 'pages/Page3';
import Page4 from 'pages/Page4';
import NotFound from 'pages/NotFound';

export default [
	{
		path: '/(ru|en|ua)',
		exact: true,
		component: Home
	},
	{
		path: '/(ru|en|ua)/about',
		exact: true,
		component: Page1
	},
	{
		path: '/(ru|en|ua)/skills',
		exact: true,
		component: Page2
	},
	{
		path: '/(ru|en|ua)/portfolio',
		exact: true,
		component: Page3
	},
	{
		path: '/(ru|en|ua)/contacts',
		exact: true,
		component: Page4
	},
	{
		path: '/(ru|en|ua)',
		exact: false,
		status: 404,
		component: NotFound
	}
];