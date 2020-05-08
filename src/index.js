export default function resettable({ ignore = [] }) {
  let initialValues;
  return {
    connect: (host, key) => {
      // Ignore all specified keys, this particular key (often "reset"), as well as the render key.
      ignore.push(key);
      ignore.push('render');

      // Set a value to trigger the observer.
      host[key] = true;
    },
    set: (host, value) => value,
    get: (host) => () => {
      // Return a function that, when called, resets all non-ignored keys.
      initialValues.forEach((value, key) => {
        host[key] = value;
      });
      return true;
    },
    observe: (host, value, oldValue) => {
      // Only set the initialValues if they've never been set before.
      if (!oldValue) {
        initialValues = Object.keys(Object.getPrototypeOf(host)).reduce(
          (acc, protoKey) => {
            if (
              !ignore.includes(protoKey) &&
              !['undefined', 'function'].includes(typeof host[protoKey])
            ) {
              acc.set(protoKey, host[protoKey]);
            }

            return acc;
          },
          new Map()
        );
      }
    },
  };
}
