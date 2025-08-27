import { type RouteConfig, index , route} from "@react-router/dev/routes";

export default [index("routes/home.tsx"),
                route('/auth' , 'routes/auth.jsx'),
                route('/upload','routes/upload.jsx')
] satisfies RouteConfig;
