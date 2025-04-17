# LazyScripts

## Usage

Insert very early in the `<head>` tag

```html
<script data-lazyscript src="https://unpkg.com/lazyscripts.js"></script>
```

### Example

> See `/tests` folder working implementation

#### WordPress

```php
add_action(
  'template_redirect',
  function () {
    ob_start(
      function ( $buffer ) {
        $html = new WP_HTML_Tag_Processor( $buffer );

        while ( $html->next_tag( 'script' ) ) {
          if ( null !== $html->get_attribute( 'data-lazyscript' ) ) {
            continue;
          }

          $src  = $html->get_attribute( 'src' );
          $type = $html->get_attribute( 'type' );

          if ( $src ) {
            $html->set_attribute( 'data-src', $src );
            $html->remove_attribute( 'src' );
          }

          if ( $type && 'text/javascript' !== $type ) {
            $html->set_attribute( 'data-type', $type );
          }

          $html->set_attribute( 'type', 'lazyscript' );
        }

        return $html->get_updated_html();
      }
    );
  }
);
```
