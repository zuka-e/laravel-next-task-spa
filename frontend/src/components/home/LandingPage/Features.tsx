import Image from 'next/image';

import { Container, Grid, Typography } from '@mui/material';

import { LinkButton } from 'templates';
import filingSystem from 'images/filing_system.svg';
import drag from 'images/drag.svg';
import search from 'images/search.svg';

/** パスを含むファイル名からパス及び拡張子を取り除く */
const basename = (filename: string) => {
  const startIndex =
    filename.lastIndexOf('/') !== -1 ? filename.lastIndexOf('/') + 1 : 0;
  const endIndex =
    filename.indexOf('.') !== -1 ? filename.indexOf('.') : filename.length;

  return filename.slice(startIndex, endIndex);
};

type FeatureLayoutProps = {
  children: React.ReactNode;
  image: string;
  header: string;
};

const FeatureLayout = (props: FeatureLayoutProps) => {
  const { children, image, header } = props;

  return (
    <Grid item md={4} sm={9} xs={11}>
      <Grid container direction="column" alignItems="center" className="gap-6">
        <div className="relative h-80 w-full">
          <Image src={image} alt={basename(image)} layout="fill" />
        </div>
        <div className="w-full">
          <Typography variant="h3" align="center">
            {header}
          </Typography>
        </div>
        <Typography paragraph>{children}</Typography>
      </Grid>
    </Grid>
  );
};

const Features = () => {
  return (
    <section className="bg-image-primary">
      <Container className="my-24 sm:min-h-[75vh]">
        <Typography variant="h2" title="Features" hidden>
          {'Features'}
        </Typography>
        <Grid container spacing={8} className="justify-around">
          <FeatureLayout image={filingSystem.src} header="サブタスク管理">
            各タスクはカードと呼ばれる単位で扱われ、リストの下に配置されます。
            リストは複数のカードを持ち、またボード上で複数のリストを管理することができます。
          </FeatureLayout>
          <FeatureLayout image={drag.src} header="ドラッグ&amp;ドロップ">
            カードはドラッグによりその配置を自由に入れ替えることが可能です。
            期限や重要度の変化に応じて常にボードの状態を更新することができます。
          </FeatureLayout>
          <FeatureLayout image={search.src} header="タスク検索">
            キーワードによってタスクを検索することが可能です。
            多くの情報の中から目的のタスクを探し出す手間を省きます。
          </FeatureLayout>
        </Grid>
        <div className="my-16 mx-auto w-80">
          <LinkButton to="/register" size="large" fullWidth>
            始める
          </LinkButton>
        </div>
      </Container>
    </section>
  );
};

export default Features;
