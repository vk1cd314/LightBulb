# Packages

### React Router

```bash
npm install react-router-dom localforage match-sorter sort-by
```

### TailwindCSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### React Icons

```bash
npm i react-icons
```

### React Hot Toast

```bash
npm install react-hot-toast
```

### Firebase

```bash
npm install firebase
```

Global colors: Go to tailwind.config.js and change the colors
Global Font: Go to tailwind.config.js and change the font family
Global Notifications: just call notifySucces or notifyError from anywhere and pass it a message as a parameter

Give `mt-20` to the top element of all pages to give space for the navbar

To add or remove items from the navbar, just edit the navItems array as shown

To make any route a private route, i.e the user has to login to acces that page, just wrap that route with the PrivateRoute component

```js
{
    path: "/settings",
    element: (
        <PrivateRoute>
            <div className="mt-20">Settings</div>
        </PrivateRoute>
    ),
},
``` 
