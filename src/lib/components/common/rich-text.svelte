<script lang="ts">
   import Editor from '@tinymce/tinymce-svelte';

   export let value = '';

   const tinyConf = {
      skin: 'oxide-dark',
      content_css: 'dark',
      height: '240',
      plugins: 'image lists link media emoticons help hr',
      toolbar:
         'undo redo | styleselect | bold italic | image link media emoticons | numlist bullist | alignleft aligncenter alignright alignjustify | outdent indent',
      branding: false,
      menu: {
         file: { title: 'File', items: 'newdocument restoredraft | preview | print ' },
         edit: { title: 'Edit', items: 'undo redo | cut copy paste | selectall | searchreplace' },
         view: { title: 'View', items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen' },
         insert: {
            title: 'Insert',
            items: 'image link media template hr | emoticons'
         },
         format: {
            title: 'Format',
            items: 'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontsizes align lineheight | forecolor backcolor | removeformat'
         },
         tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | code wordcount' },
         table: { title: 'Table', items: 'inserttable | cell row column | tableprops deletetable' },
         help: { title: 'Help', items: 'help' }
      }
   };
</script>

<Editor bind:value apiKey="exazeg2vdh0ox3tw6bdnrtaos2b73zpo5fxd26vrnafexnls" conf={tinyConf} channel="5" />
