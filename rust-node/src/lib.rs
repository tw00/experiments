extern crate base64;

// use fasthash::{ lookup3, mum, murmur, murmur2, sea, t1ha, xx }
use fasthash::{city, farm, metro, murmur3, spooky};
use neon::prelude::*;
use std::mem::transmute;

fn js_hash(mut cx: FunctionContext) -> JsResult<JsString> {
  let input = cx.argument::<JsString>(0)?.value(&mut cx);
  let algo: String = cx
    .argument_opt(1)
    .unwrap_or_else(|| cx.undefined().upcast())
    .to_string(&mut cx)?
    .value(&mut cx);

  let hash_fn = match algo.as_ref() {
    "city" => city::hash128,
    "farm" => farm::hash128,
    "metro" => metro::hash128,
    "murmur3" => murmur3::hash128,
    "spooky" => spooky::hash128,
    // "mum" => mum::hash64,
    // "murmur2" => murmur2::hash64,
    // "sea" => sea::hash64,
    // "t1ha" => t1ha::hash64,
    // "xx" => xx::hash64,
    // "lookup3" => lookup3::hash32,
    // "murmur" => murmur::hash32,
    _ => metro::hash128,
  };

  let hash_num = hash_fn(&input);
  let bytes: [u8; 16] = unsafe { transmute(hash_num.to_be()) };
  let base64 = format!("{}", base64::encode_config(&bytes, base64::BCRYPT));
  Ok(cx.string(base64))
}

fn js_get_num_cpus(mut cx: FunctionContext) -> JsResult<JsNumber> {
  Ok(cx.number(num_cpus::get() as f64))
}

fn js_hello(mut cx: FunctionContext) -> JsResult<JsString> {
  Ok(cx.string("hello node"))
}

fn js_get_by_id(mut cx: FunctionContext) -> JsResult<JsString> {
  // Get the first argument as a `JsNumber` and convert to an `f64`
  let id = cx.argument::<JsNumber>(0)?.value(&mut cx);
  let res = format!("Your ID is {id}", id = id);
  Ok(cx.string(res))
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
  cx.export_function("hello", js_hello)?;
  cx.export_function("get_by_id", js_get_by_id)?;
  cx.export_function("get_num_cpus", js_get_num_cpus)?;
  cx.export_function("hash", js_hash)?;
  Ok(())
}
