import { supabase } from "@/lib/supabase";

export async function getTallas() {

const { data, error } =
await supabase
.from("tallas")
.select("*")
.order("nombre");

if (error) {
throw error;
}

return data;

}

export async function createTalla(
values
) {
    

const { error } =
await supabase
.from("tallas")
.insert([values]);

if (error) {
throw error;
}

}

export async function updateTalla(
id,
values
) {

const { error } =
await supabase
.from("tallas")
.update(values)
.eq("id", id);

if (error) {
throw error;
}

}

export async function desactivarTalla(
id
) {

const { error } =
await supabase
.from("tallas")
.update({
activo: false,
})
.eq("id", id);

if (error) {
throw error;
}

}

export async function activarTalla(
id
) {

const { error } =
await supabase
.from("tallas")
.update({
activo: true,
})
.eq("id", id);

if (error) {
throw error;
}

}
