module.exports = {
  routes: {
    // Notice that routes is a dictionary, not a list.
    // This makes it easier for plugins to modify routes.

    // The route key will be mapped to VueRouter's route name.
    user: {

      // path key is the same.
      path: '/user/:id',

      // will be built by the webpack-loader into a vue component
      layout: {
        name: 'Simple',
        children: [
          { name: 'HelloWorld' },
        ],
      },

      // optional meta information about a route.
      // may include additional data that widgets such as a tab widget should
      // use for rendering route tabs.  These are renderer specific and will not
      // alter any part of the build process.
      meta: {
        tab: true, // this route is part of the tab
        name: 'Users', // A hunan-readable name for the tab,
        icon: 'user', // An icon to be used by the tab list renderer
      },
    },
    admin: {},
  },

  // Root layout, same schema as other layouts.
  // Should contain RouterView somewhere in its tree if
  // routes are to be displayed.
  root: {
    children: [
      {
        name: 'TwoColumn',
        // Layout children have a property
        layout: {
          left: {
            children: [],
          },
          right: {
            children: [{ name: 'HelloWorld' }],
          },
        }
      },
    ],
  },

  // Component definitions, for use in containers.
  // Provide default props and namespace, though these can be overridden.
  components: {
    // Widget names are translated into kebab case
    GirderDataBrowser: {
      // Path to insert ES6 import from project root
      path: 'src/components/DataBrowser.vue',

      // Default namespace of the component.
      namespace: 'girder',

      // Widgets can only take static props.
      // Container components have no data property
      props: {
        selectEnabled: true,
      },
    },
    HelloWorld: {
      path: 'src/components/HelloWorld.vue',
      props: {
        namespace: 'default',
        msg: 'Howdy',
      },
    },
    Search: {},
    CreateFolder: {},
    RouterView: {
      // special case for global and html-native tags
      path: null,
    },
    Tabs: {},
    TwoColumn: {
      path: 'containers/two-column.gpug',
    },
  },

  // meta can contain any other static configuration you would like to
  // expose to plugins.
  meta: {
    vuetifyConfig: {},
  },
};
