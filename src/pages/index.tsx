import Head from "next/head";
import styles from "../../styles/page.module.css"
import Image from "next/image";

import heroImg from "../../public/assets/hero.png";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tarefas+ | Organize suas tarefas de forma fácil</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image
            className={styles.hero}
            alt="Logo tarefas"
            src={heroImg}
            priority
          >
          </Image>
        </div>

        <h1 className={styles.title}>
          Sistema feito para você organizar <br />
          seus estudos e tarefas
        </h1>

      <div className={styles.infoContent}>
        <section className={styles.box}>
          <span>
            +12 posts
          </span>
        </section>
        <section className={styles.box}>
          <span>
            +90 comentários
          </span>
        </section>
      </div>

      </main>
    </div>
  );
}
