const LabelInput: React.FC = () => {
    return (
        <div>
            <label htmlFor="Email" className="relative">
                <input
                    type="email"
                    id="Email"
                    placeholder=""
                    className="peer mt-0.5 w-full rounded border-zinc-300 shadow-sm sm:text-sm dark:border-zinc-500 dark:bg-zinc-800 dark:text-white"
                />

                <span className="absolute inset-y-0 start-3 -translate-y-5 bg-white px-0.5 text-sm font-medium text-zinc-300 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5 dark:bg-zinc-800 dark:text-zinc-300">
                    Email
                </span>
            </label>
        </div>
    );
};

export default LabelInput;
