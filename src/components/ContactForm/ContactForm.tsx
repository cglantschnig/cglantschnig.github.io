import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import classes from './ContactForm.module.scss';
import axios from "axios";

const ContactSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  message: z.string().min(10)
})

type ContactSchemaType = z.infer<typeof ContactSchema>;

function ContactForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactSchemaType>({
    resolver: zodResolver(ContactSchema),
  });
 
  const onSubmit: SubmitHandler<ContactSchemaType> = async (data) => {
    await axios.post('/.netlify/functions/send-contact-email', data);
    reset();
  };
 
 return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <div className={classes.formField}>
        <label>Name<span className={classes.required}>*</span></label>
        <input type="text" {...register("name")} />
        {errors.name && <span className={classes.error}>Name is required</span>}
      </div>
      <div className={classes.formField}>
        <label>Email<span className={classes.required}>*</span></label>
        <input type="text" {...register("email")} />
        {errors.email && <span className={classes.error}>Email is required</span>}
      </div>
      <div className={classes.formField}>
        <label>Message<span className={classes.required}>*</span></label>
        <textarea {...register("message")} />
        {errors.message && <span className={classes.error}>Message must have at least 10 characters</span>}
      </div>
      <input type="submit" value="Send" />
    </form>
  );
}

export default ContactForm;
