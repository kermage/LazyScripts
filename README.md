# LazyScripts

> "A lightweight JS utility that loads your scripts only after user interaction or after a specified time."

## Usage

Add the main loader `<script>` tag normally to your HTML:

```html
<script src="https://unpkg.com/lazyscripts.js" data-timeout="3500" data-lazyscripts></script>
```

- `data-timeout="3500"` — (optional) Force load all scripts after 3.5 seconds if no user interaction detected
- `data-lazyscripts` — (optional) Script identifier for integrations like WordPress; [see example below](#wordpress)

Update scripts to use `type="lazyscript"` and specify the URL in `data-src`:

```html
<script type="lazyscript" data-src="https://example.com/heavy.js"></script>
```

Module scripts are supported and can be specified with `data-type="module"`:

```html
<script type="lazyscript" data-src="https://example.com/app.js" data-type="module"></script>
```

Inline scripts and the loading strategies `async` & `defer` are supported as well:

```html
<script type="lazyscript">
  console.log("Inline script", "LOADED!");
</script>

<script type="lazyscript" data-src="analytics.js" async></script>
<script type="lazyscript" data-src="vendor.js" defer></script>
```

## Example

Check the [`/tests`](/tests) folder for a working implementation.

### WordPress

Automatically convert all scripts to lazy-loaded versions using the [`WP_HTML_Tag_Processor`](https://developer.wordpress.org/reference/classes/wp_html_tag_processor):

```php
add_action(
  'template_redirect',
  function () {
    ob_start(
      function ( $buffer ) {
        $html = new WP_HTML_Tag_Processor( $buffer );

        while ( $html->next_tag( 'script' ) ) {
          if ( null !== $html->get_attribute( 'data-lazyscripts' ) ) {
            continue; // Skip the main loader
          }

          $src  = $html->get_attribute( 'src' );
          $type = $html->get_attribute( 'type' );

          if ( $src ) {
            $html->set_attribute( 'data-src', $src );
            $html->remove_attribute( 'src' );
          }

          if ( $type && ! in_array( $type, array( 'text/javascript', 'module' ), true ) ) {
            // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type
            continue;
          }

          $html->set_attribute( 'data-type', $type );
          $html->set_attribute( 'type', 'lazyscript' );
        }

        return $html->get_updated_html();
      }
    );
  }
);
```
