import { GetServerSideProps } from 'next';
import styles from './styles.module.css';
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import { TextArea } from '@/components/textarea';
import { FiShare2 } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { db } from '@/services/firebaseConnection';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import Link from 'next/link';

interface DashboardProps {
    user: {
        email: string
    }
}

interface TaskProps {
    id: string;
    created_at: Date;
    is_public: boolean;
    tarefa: string;
    user: string;

}

export default function Dashboard({user}: DashboardProps) {
    const [input, setInput] = useState("");
    const [publicTask, setPublicTask] = useState(false);
    const [tasks, setTasks] = useState<TaskProps[]>([])

    useEffect(() => {
        loadTarefas();
    }, [user?.email]);
    
    const loadTarefas= async() => {
        const tarefasRef = collection(db, "tasks");
        const q = query(
            tarefasRef,
            orderBy("created_at", "desc"),
            where("user", "==", user?.email)
        )

        onSnapshot(q, (snapshot) => {
            let taskList = [] as TaskProps[];
            snapshot.forEach((doc) => {
                taskList.push({
                    id: doc.id,
                    tarefa: doc.data().tarefa,
                    created_at: doc.data().created_at,
                    user: doc.data().user,
                    is_public: doc.data().is_public
                })
            });

            setTasks(taskList);
        });
    }

    const handleChangePublic = (event: ChangeEvent<HTMLInputElement>) => {
        setPublicTask(event.target.checked);
    }

    const handleRegisterTask = async (event: FormEvent) => {
        event.preventDefault();

        if(input === "") return;

        try {
            await addDoc(collection(db, "tasks"), {
                tarefa: input,
                created_at: new Date(),
                user: user?.email,
                is_public: publicTask
            })

            setInput("");
            setPublicTask(false);
        } catch(err) {

        }
    }

    const handleShare = async (id: string) => {
        await navigator.clipboard.writeText(
            `${process.env.NEXT_PUBLIC_URL}/${id}`
        )
    }

    const handleDelete = async (id: string) => {
        const docRef = doc(db, "tasks", id);
        await deleteDoc(docRef);
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>
                    Meu painel de tarefas
                </title>
            </Head>
            
            <main className={styles.main}>

                <section className={styles.content}>
                    <div className={styles.contentForm}>
                        <h1 className={styles.title}>
                            Qual sua tarefa?
                        </h1>
                        
                        <form onSubmit={handleRegisterTask}>
                            <TextArea
                                placeholder='Digite aqui sua tarefa...'
                                value={input}
                                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)}
                            />
                            <div className={styles.checkboxArea}>
                                <input 
                                    type="checkbox" 
                                    className={styles.checkbox} 
                                    checked={publicTask}
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleChangePublic(event)}
                                />
                                <label>Deixar tarefa publica?</label>
                            </div>
                            <button type='submit' className={styles.registerButton}>
                                Registrar
                            </button>

                        </form>

                    </div>
                </section>

                <section className={styles.taskContainer}>
                    <h1>
                        Minhas Tarefas
                    </h1>

                    {tasks.map((item) => (
                        <article key={item.id} className={styles.task}>
                            {
                                item.is_public && (
                                <div className={styles.tagContainer}>
                                    <label className={styles.tag}> PUBLICO </label>
                                    <button className={styles.shareButton} onClick={() => handleShare(item.id)}>
                                    <FiShare2
                                        size={22}
                                        color="#3183ff"
                                    />
                                    </button>
                                </div>
                                )
                            }
    
                            <div className={styles.taskContent}>
                                
                                {item.is_public 
                                ? 
                                    <Link href={`/tasks/${item.id}`}>
                                        <p>{item.tarefa}</p>
                                    </Link>
                                : (
                                    <p>{item.tarefa}</p>
                                )
                                
                                }

                                <button className={styles.trashButton} onClick={() => handleDelete(item.id)}>
                                    <FaTrash 
                                        size={24}
                                        color='ea3140'
                                    />
                                </button>
                            </div>
                        
                        </article>
                        ))
                    }

                </section>

            </main>

        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req}) => {  
    const session = await getSession({req});

    if(!session?.user) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    return  {
        props: {
            user: {
                email: session?.user?.email,
            }
        },
    };
};