
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from "zod"
import axios from "axios"

export function Form() {
    const createUserSchema = z.object({
        name: z.string().nonempty('O nome é obrigatorio'),
        password: z.string().min(6, 'Minimo de 6 caracteres'),
        age: z.number({
            required_error: 'O campo idade é obrigatório',
            invalid_type_error: 'Caracteres inseridos são invalidos'
        }).min(18, "Idade minima é de 18 anos").max(100),
        email: z.string().nonempty('O email é obrigatorio').email('Formato do email é invalido'),
    })

    type CreateUserFormData = z.infer<typeof createUserSchema>

    const [output, setOutput] = useState('')
    const { register, handleSubmit, formState: { errors } } = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema)
    })

    async function createUser(data: CreateUserFormData) {
        const baseURL = "http://localhost:3000";

        const api = axios.create({
            baseURL,
            headers: {
                "Content-Type": "application/json",
            },
        });

        try {
            await api.post('/users', JSON.stringify(data, null, 2)); // Envie os dados usando o Axios
            setOutput('Usuário criado com sucesso!'); // Atualize a saída com uma mensagem de sucesso
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            setOutput('Erro ao criar usuário. Verifique o console para mais informações.'); // Atualize a saída com uma mensagem de erro
        }
    }

    console.log(errors)

    return (
        <main className="h-screen bg-zinc-950 gap-10 text-zinc-300 flex flex-col items-center justify-center">
            <h1 className='text-4xl font-semibold'>Formulário de Cadastro</h1>
            <form onSubmit={handleSubmit(createUser)} className="flex flex-col w-full max-w-sm gap-4">
                <div className="flex flex-col gap-1 ">
                    <label htmlFor="">Nome</label>
                    <input type="text"
                        className="bg-zinc-900 px-3 shadow-sm rounded border-zinc-800  h-9"
                        {...register('name')}
                    />
                    {errors.name && <span className="text-red-400 text-sm">{errors.name.message}</span>}

                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="">Idade</label>
                    <input type="number"
                        className="bg-zinc-900 px-3 shadow-sm rounded border-zinc-800  h-9"
                        {...register('age', { valueAsNumber: true })}
                    />
                    {errors.age && <span className="text-red-400 text-sm">{errors.age.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="">E-mail</label>
                    <input type="email"
                        className="bg-zinc-900 px-3 shadow-sm rounded border-zinc-800  h-9"
                        {...register('email')}
                    />
                    {errors.email && <span className="text-red-400 text-sm">{errors.email.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="">Senha</label>
                    <input type="password"
                        className="bg-zinc-900 px-3 shadow-sm rounded border-zinc-800  h-9"
                        {...register('password')}
                    />
                    {errors.password && <span className="text-red-400 text-sm">{errors.password.message}</span>}
                </div>

                <button className="bg-emerald-500 rounded font-semibold h-10 m hover:bg-emerald-600" type="submit">Salvar</button>
            </form>
            <pre>{output}</pre>
        </main>
    )
}