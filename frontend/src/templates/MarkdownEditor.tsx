import { memo, useCallback, useEffect, useState, type JSX } from 'react';
import dynamic from 'next/dynamic';
import { yupResolver } from '@hookform/resolvers/yup';
import { CardActions } from '@mui/material';
import type { MarkdownPreviewProps } from '@uiw/react-markdown-preview';
import type { MDEditorProps, PreviewType } from '@uiw/react-md-editor';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { mdCommands } from '@/config/mdEditor';
import { Fieldset, SubmitButton } from '@/templates';

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
  { ssr: false },
);

/**
 * When used with `<MDEditor.Markdown>`, the error occurred.
 * @see https://github.com/uiwjs/react-md-editor/issues/224#issuecomment-1030261498
 */
const MarkdownPreview = dynamic<MarkdownPreviewProps>(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false },
);

type MarkdownEditorProps = {
  schema: yup.StringSchema<
    string | undefined,
    yup.AnyObject,
    string | undefined
  >;
  defaultValue?: string;
  onSubmit: (text: string) => void;
  isLoading: boolean;
};

const MarkdownEditor = memo(function MarkdownEditor(
  props: MarkdownEditorProps,
): JSX.Element {
  const { schema, defaultValue, isLoading, onSubmit } = props;

  const [mode, setMode] = useState<PreviewType>(
    defaultValue ? 'preview' : 'edit',
  );

  const fieldName = 'content';

  const {
    formState: { errors },
    control,
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(
      yup.object().shape({
        [fieldName]: schema,
      }),
    ),
  });

  const handleClickPreview = useCallback((): void => {
    setMode('edit');
  }, []);

  const onValid: Parameters<typeof handleSubmit>[0] = useCallback(
    (data): void => {
      if (data[fieldName] === defaultValue) {
        setMode('preview');
        return;
      }

      onSubmit(data[fieldName] ?? '');
    },
    [defaultValue, onSubmit],
  );

  // 表示するデータが変更された場合に値を初期化する
  useEffect(() => {
    setMode(defaultValue ? 'preview' : 'edit');
  }, [defaultValue]);

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
    <form onSubmit={handleSubmit(onValid)}>
      <Fieldset disabled={isLoading}>
        {/* cf. https://react-hook-form.com/get-started/#IntegratingwithUIlibraries */}
        <Controller
          control={control}
          name={fieldName}
          defaultValue={defaultValue}
          render={({ field }) => (
            <MDEditor
              autoFocus
              preview={mode}
              commands={mdCommands}
              className={
                errors[fieldName] ? 'outline outline-1 outline-error' : ''
              }
              {...field}
              textareaProps={{
                placeholder: 'Enter the text',
              }}
            />
          )}
        />
        <div className="my-2 flex items-baseline">
          {errors[fieldName] && (
            <span className={'text-error'}>{errors[fieldName].message}</span>
          )}
          <SubmitButton size="small" className="ml-auto">
            {'Save'}
          </SubmitButton>
        </div>
      </Fieldset>
    </form>
  );
});

export default MarkdownEditor;
