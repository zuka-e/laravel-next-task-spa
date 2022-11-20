import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { ObjectShape } from 'yup/lib/object';
import { CardActions } from '@mui/material';
import type { MDEditorProps, PreviewType } from '@uiw/react-md-editor';
import type { MarkdownPreviewProps } from '@uiw/react-markdown-preview';

import { mdCommands } from 'config/mdEditor';
import { SubmitButton } from 'templates';

// cf. https://github.com/uiwjs/react-md-editor/issues/52
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

/**
 * When used with `import MDEditor`, the following error occurred.
 * ```text
 * Error [ERR_REQUIRE_ESM]: require() of ES Module ~/react-markdown/index.js
 * from ~/@uiw/react-markdown-preview/lib/index.js not supported.
 * Instead change the require of ~/react-markdown/index.js
 * in ~/@uiw/react-markdown-preview/lib/index.js
 * to a dynamic import() which is available in all CommonJS modules.
 * ```
 * To solve it,
 * @see https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr
 * @see https://github.com/uiwjs/react-md-editor/issues/224#issuecomment-907679744
 */
const MDEditor = dynamic<MDEditorProps>(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

/**
 * When used with `<MDEditor.Markdown>`, the error occurred.
 * @see https://github.com/uiwjs/react-md-editor/issues/224#issuecomment-1030261498
 */
const MarkdownPreview = dynamic<MarkdownPreviewProps>(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false }
);

type MarkdownEditorProps = {
  schema: yup.ObjectSchema<ObjectShape>;
  onSubmit: (text: string) => void;
  defaultValue?: string;
};

const MarkdownEditor = (props: MarkdownEditorProps) => {
  const { schema, defaultValue } = props;
  const prop: keyof typeof schema.fields = Object.keys(schema.fields)[0];
  const [mode, setMode] = useState<PreviewType>(
    defaultValue ? 'preview' : 'edit'
  );
  const {
    formState: { errors },
    control,
    handleSubmit,
    resetField,
  } = useForm<Record<typeof prop, string>>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const handleClickPreview = () => {
    setMode('edit');
  };

  const onSubmit: SubmitHandler<Record<typeof prop, string>> = (data) => {
    if (data[prop] === defaultValue) {
      setMode('preview');
      return;
    }

    props.onSubmit(data[prop]);
  };

  // 表示するデータが変更された場合に値を初期化する
  useEffect(() => {
    setMode(defaultValue ? 'preview' : 'edit');
    resetField(prop, { defaultValue });
  }, [defaultValue, prop, resetField]);

  if (mode === 'preview' && defaultValue)
    return (
      <CardActions
        onClick={handleClickPreview}
        className="overflow-y-auto rounded outline-1 hover:outline"
      >
        <MarkdownPreview source={defaultValue} />
      </CardActions>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* cf. https://react-hook-form.com/get-started/#IntegratingwithUIlibraries */}
      <Controller
        control={control}
        name={prop}
        defaultValue={defaultValue}
        render={({ field }) => (
          <MDEditor
            autoFocus
            preview={mode}
            commands={mdCommands}
            className={errors[prop] ? 'outline outline-1 outline-error' : ''}
            {...field}
            textareaProps={{
              placeholder: 'Enter the text',
            }}
          />
        )}
      />
      <div className="my-2 flex items-baseline">
        <span className={errors[prop] ? 'text-error' : ''}>
          {errors[prop]?.message}
        </span>
        <SubmitButton size="small" className="ml-auto">
          {'Save'}
        </SubmitButton>
      </div>
    </form>
  );
};

export default MarkdownEditor;
